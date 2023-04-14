
cols = Array.from(document.getElementsByTagName("td"));
var message = document.getElementById('message');
var inputline = document.getElementById("inputline")
function toggleMode(){
  message.classList.toggle('hidden');
}

function showStatement(){
  
    message.classList.add('visible');
  
}

function hideStatement(){
    message.classList.remove('visible');
}

// dynamically creating input tags.
function makeeditable(){
  var variable = 0;
  
  cols.forEach(element => {
    
    element.innerHTML +=`
    <input name=\"somename\"
    oninput=\"javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);\"
    type = \"number\"
    maxlength = "1"
    />
    `
    variable++;
  });
}
makeeditable();

function disable_input_line(){
  inputline.classList.add("hidden");
}
function enable_input_line(){
  inputline.classList.remove("hidden");
}


inputTags = Array.from(document.getElementsByTagName("input"));

inputTags.forEach(ele => {
  ele.addEventListener('input',()=>{
    disable_input_line();
    
  })
});

var valuesOfInput = [];//array to be solved
var valuesOfInput2 = [];// copy for the edit button
var mainarr=[];//this is also a copy for the coordination of all three buttons

// creation of 2d array 
for (let i = 0; i < 9; i++) {
  valuesOfInput[i] = [];
  valuesOfInput2[i] = [];
  mainarr[i]=[];
}

// filling initially to zero all cells of matrix
for (let r = 0; r < 9; r++) {
  for (let c = 0; c < 9; c++) {
    valuesOfInput[r][c]=0;
    valuesOfInput2[r][c] = 0;
  }
}

// function to print values of array on console
function printvalues() {
  for (let a = 0; a < 9; a++) {
    for (let b = 0; b < 9; b++) {
      console.log(valuesOfInput[a][b]);
    }
  }
}




function Makedisable(){
  for(let i=0;i<inputTags.length;i++){
    inputTags[i].disabled=true;
  }
}

function MakeEnable(){
  for(let i=0;i<inputTags.length;i++){
    inputTags[i].disabled=false;
  }
}
function isCharacterALetter(char) {
  return (/[a-zA-Z]/).test(char)
}
function getvaluesfromInputTags(){
  let i=0;
  for(let a=0;a<9;a++){
    for(let b=0;b<9;b++){
      if(inputTags[i].value==""){
        mainarr[a][b]=0;
      }
      
      else{
        mainarr[a][b]=parseInt(inputTags[i].value);
      }
      i++;
    }
  }
}

// function to fill the array with input values
function fillarray() {
  let i=0;
  for (let a = 0; a < 9; a++) {
    for (let b = 0; b < 9; b++) {
      valuesOfInput[a][b]=mainarr[a][b];
    }
  }
  
}

function copyarr(){
  let i=0;
  for (let a = 0; a < 9; a++) {
    for (let b = 0; b < 9; b++) {
        if(inputTags[i].value != ""){   
          valuesOfInput2[a][b]=valuesOfInput[a][b]; 
          mainarr[a][b]=valuesOfInput[a][b]; 
        }
        i++;
    }
  }
}


function fillcolumnsWithduplicates() {
  let i=0;
  for (let a = 0; a < 9; a++) {
    for (let b = 0; b < 9; b++) {
        if(valuesOfInput2[a][b] == 0){
          inputTags[i].value="";
        }
        else{
          inputTags[i].value=valuesOfInput2[a][b];
        }
        i++;
    }
  }
}

function cleararrays(){
  for (let a = 0; a < 9; a++) {
    for (let b = 0; b < 9; b++) {
         
          valuesOfInput2[a][b]=0; 
          mainarr[a][b]=0; 
        
        
    }
  }
}

function clearInputTags(){
  for(let i=0;i<81;i++){
    inputTags[i].value="";
  }
  
}

function resolveAfter2Seconds(sp) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("resolved");
    }, sp);
  });
}


async function fillinputtags(){
  let i=0;
  for (let a = 0; a < 9; a++) {
    for (let b = 0; b < 9; b++) {
        await resolveAfter2Seconds(50);
        if(valuesOfInput[a][b] == 0){
          inputTags[i].value="";
        }
        else{
          inputTags[i].value=valuesOfInput[a][b];
        }
        i++;
    }
  }
  if(edit_button.disabled){
    edit_button.disabled=false;
   look_enabled(edit_button);
  }
  if(reset_button.disabled){
    reset_button.disabled=false;
    look_enabled(reset_button);
  }
}
/**************************************************************************************/
solved_is_on = false;
edit_is_on = false;

solve_button = document.getElementById("solve");
edit_button = document.getElementById("edit");
reset_button = document.getElementById('reset');

edit_button.addEventListener('click',()=>{
    hideStatement();
    MakeEnable();
    clearInputTags();
    fillcolumnsWithduplicates();
});




reset_button.addEventListener('click',()=>{
  hideStatement();
  enable_input_line();
  clearInputTags();
  cleararrays();
  MakeEnable();
})

function look_disabled(btn){
  btn.style.opacity=0.3;
}
function look_enabled(btn){
  btn.style.opacity=1;
}

solve_button.addEventListener('click',()=>{
  
  if(edit_button.disabled==false){
    edit_button.disabled=true;
    look_disabled(edit_button);
    
    
  }
  if(reset_button.disabled == false){
    reset_button.disabled=true;
    look_disabled(reset_button);
    
  }
  getvaluesfromInputTags();
  fillarray();
  copyarr();
  Makedisable();
 
 
//  here using array because to chaged configuration get displayed

  let count=[0];
  var ans_from_sodoku = sodokusolver(valuesOfInput,count);

 
  if(ans_from_sodoku == false){
    
    showStatement();
    if(edit_button.disabled){
      edit_button.disabled=false;
     look_enabled(edit_button);
    }
    if(reset_button.disabled){
      reset_button.disabled=false;
      look_enabled(reset_button);
    }
  }
  else{
    fillinputtags();
    
  }
  
})



/******************************* the sodoku solver code******************************************************/
function isSafe(k,row, col, board) {
  for (let i = 0; i < 9; i++) {
      const m = 3 * Math.floor(row / 3) + Math.floor(i / 3);
      const n = 3 * Math.floor(col / 3) + i % 3;
      if (board[row][i] == k || board[i][col] == k || board[m][n] == k) {
        return false;
      }
  }
  return true;
}


function sodokusolver(valuesOfInput,count) {

  if(count[0] > 50000){
    return false;
  }

  for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
          
          if (valuesOfInput[row][col]== 0) {
            
              for (var i = 1; i <= 9; i++) {

                  if (isSafe(i, row, col, valuesOfInput) == true) {
                      
                      // let result = makewait();
                      valuesOfInput[row][col] = i;
                     
                      
                      if (sodokusolver(valuesOfInput,count)) {
                          return true;
                      }
                      
                      valuesOfInput[row][col] = 0;
                      
                      
                  }

              }
              count[0]++;
              return false;

          }


      }
  }

  return true;
}