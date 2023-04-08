let QUESTIONS;
let questionIndexes;
let choosenQuestions;
let finalQuestions = []
let isFileUpload = false;

const quesDiv = document.getElementById('quest')
const optionA = document.getElementById('option-A')
const optionB = document.getElementById('option-B')
const optionC = document.getElementById('option-C')
const optionD = document.getElementById('option-D')
const optionE = document.getElementById('option-E')
const nextButton = document.getElementById('next')
const remain = document.getElementById('ques-remain')
const trueFalse = document.getElementById('true-false') 


file.addEventListener('change', (e) => {
    const file = document.getElementById('file');
    let tempQuestions;


    const f = file.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
        tempQuestions = e.target.result.split(/\r\n|\n/);
        QUESTIONS = makeTemplate(tempQuestions);

        // let temp = document.getElementById('temp');
        // temp.innerHTML = QUESTIONS[10].question; 
        
    }

    reader.readAsText(f);
    isFileUpload = true;

    
})


const submitQuestions = document.getElementById("submit-questions");

submitQuestions.addEventListener('click', e => {
    const infoSpan = document.getElementById("number-of-questions") 
    if (!isFileUpload){
        infoSpan.innerHTML = "please upload file"
        return
    }

    const input = document.getElementById("choosen-ques").value;
    
    const reqExp = /(\d+)(?:-(\d+))?/
    
    const indexes = reqExp.exec(input)
    indexes.shift()
    

    choosenQuestions = QUESTIONS.slice(indexes[0] - 1, indexes[1] - 1)
    infoSpan.innerHTML = `${choosenQuestions.length} questions were selected`
    
    const countLabel = document.getElementById('count-label')
    const countInput = document.getElementById('count-of-questions')
    const submitCount = document.getElementById('submit-count')

    countInput.min = 1
    countInput.max = choosenQuestions.length
    countInput.style.display = "inline-block"
    countLabel.style.display = "inline-block"
    submitCount.style.display = "inline-block"

    submitCount.addEventListener('click', e => {
        const options = [optionA, optionB, optionC, optionD, optionE]

        for (option of options){
            option.style.backgroundColor = 'white'
        }

        main()
    })
})





function makeTemplate(arr, wrongSym = '•', trueSym = '√', answerCount = 5){
    let questions = []
    
    let obj = Object.create(null);
    obj.wrongAnswers = []

    let question = ''

    for(index in arr){

        if (obj.wrongAnswers.length === (answerCount - 1) && obj.trueAnswer){
            questions.push(obj);
            obj = Object.create(null);
            obj.wrongAnswers = [];
        }

        if (arr[index].charAt(0) === wrongSym || arr[index].charAt(0) === trueSym){

            
            if (question !== ''){
                obj.question = question;
                question = '';
            }

            if (arr[index].charAt(0) === trueSym){
                obj.trueAnswer = arr[index];
                continue;
            }
            else {
                obj.wrongAnswers.push(arr[index]);
                continue;
            }

        }
        
        question += `${arr[index]} \n`;
    }
    questions.push(obj)

    return questions;
}



function main(){
    finalQuestions = []
    
    const count = document.getElementById('count-of-questions').value

    quesIndexes = []
    for (i = 0; i < count; i++){
        while (true){
            check = Math.floor(Math.random() * choosenQuestions.length)
            if (!quesIndexes.includes(check)){
                quesIndexes.push(check)
                break
            }
        }
       
       
    }

    

    for(let i of quesIndexes){
        finalQuestions.push(choosenQuestions[i])
    }

    let trueAnswers = 0

    let quesNumber = 0
    showTest(finalQuestions[0], 1)

    nextButton.addEventListener('click', e => {
        if (quesNumber < finalQuestions.length){
            showTest(finalQuestions[++ quesNumber], quesNumber + 1)
        }

        const options = [optionA, optionB, optionC, optionD, optionE]

        for (option of options){
            option.style.backgroundColor = 'white'
        }
        
    })
    


}




function shuffle(arr){
    for (i = arr.length - 1; i > 0; i--){
        alter = Math.floor(Math.random() * (i + 1))
        temp = arr[i]
        arr[i] = arr[alter]
        arr[alter] = temp
    }

    return arr
}




function showTest(question, count){
    let trueAnswers = 0
    
    quesDiv.innerHTML = question.question
    quesDiv.style.opacity = "1"

    let options = ['a', 'b', 'c', 'd', 'e']
    options = shuffle(options)
       
    const optionsMap = {
        'a': optionA,
        'b': optionB,
        'c': optionC,
        'd': optionD,
        'e': optionE
    }


    let trueAnswer = optionsMap[options[0]]
    trueAnswer.innerHTML = question.trueAnswer.substring(1)
    trueAnswer.style.opacity = '1'
    addClickEvent(trueAnswer, true)
    options.shift()


    let ind = 0
    for(let option of options){
        optionsMap[option].innerHTML = question.wrongAnswers[ind++].substring(1)
        optionsMap[option].style.opacity = '1'
        addClickEvent(optionsMap[option], false, trueAnswer)
    }

    nextButton.style.opacity = '1'
    remain.textContent = `question: ${finalQuestions.length} / ${count}`
    trueFalse.textContent = `true: ${trueAnswers} false: ${count - trueAnswers}`
    


    function addClickEvent(opt, isTrue, trueOpt = null){
        if (isTrue){
            opt.addEventListener('click', trueClick)
        }
        else {
            opt.addEventListener('click', wrongClick)
        }
       
    }

    function trueClick(e){
        e.target.style.backgroundColor = 'green'
        e.target.removeEventListener('click', trueClick)
    }

    function wrongClick(e){
        e.target.style.backgroundColor = 'red'
        e.target.removeEventListener('click', wrongClick)
    }

}




