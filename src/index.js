import './style.css';
import forminputs from './forminputvalue.js'
import createcards from './createcardmodule.js'
import { format } from "date-fns";

let submitbutton = document.getElementById('cardcreateform')
let sidebar = document.getElementById('sidebar')
let contentcontainer = document.getElementById('content')
let editwindow = document.getElementById('editwindow')
let editformsubmit = document.getElementById('editform')

let localsave = []

//When called saves localsave's contents to localStorage.
function saveToLocalStorage(data){
    try {
        if(Array.isArray(data)){
            localStorage.setItem("localsave", JSON.stringify(data)); 
            return true;
        } else {
            console.error('data is not an array');
            return false;
        }
    } catch (error) {
        console.error('Error saving data to localStorage:', error);
        return false;
    }
}

//Calls saveToLocalStorage when the page is closed or reloaded.
window.addEventListener('beforeunload', () => {
    saveToLocalStorage(localsave);
});

//Restores from localStorage on page load. Uncomment the splice to remove the top 2 entries if there a bugged save entry.
function storagerestore() {


    try {
        localsave = JSON.parse(localStorage.getItem('localsave'))
        // localsave.splice(1, 2)
    } catch (error) {
        console.error('Error parsing JSON data:', error)
        localsave = []
    }

    if (Array.isArray(localsave)) {
        if (localsave.length > 0) {
            createcards.createcard(localsave)
        }

        for (const entry of localsave) {
            if (entry.category !== 'categorydiv') {
                createButtons(entry.id, entry.elementname, entry.checkmark)
            } 
        }
    }
    entrycounter()
}

storagerestore()

//Pulls data from the form then generates a template using that data,  uses that to create an element with that information, adds buttons, and finally updates the counters.
submitbutton.addEventListener('submit', (event) => {
    event.preventDefault()

    //For easy reference of what data the other functions have to work with
    let cardtemplates = [{ 
        'elementname': '',
        'elementtype': 'p',
        'category': 'content',
        'date': '',
        'unformateddate': '',
        'text': '',
        'status': '',
        'button': 'Delete',
        'delete': 'yes',
        'class': '',
        'id': crypto.randomUUID(),
        'counterid': '',
        'checkmark': ''
        }]

    cardtemplates[0] = forminputs.formobject(submitbutton)
    cardtemplates[0].elementtype = 'p'
    cardtemplates[0].category = 'content'
    cardtemplates[0].unformateddate = cardtemplates[0].date
    cardtemplates[0].date = format(cardtemplates[0].date,'Pp')
    cardtemplates[0].button = 'Delete'
    cardtemplates[0].delete = 'yes'
    cardtemplates[0].class = ''
    cardtemplates[0].id = crypto.randomUUID()
    cardtemplates[0].counterid = 'taskcategorycard' + cardtemplates[0].elementname
    cardtemplates[0].checkmark = ''


    submitbutton.reset()

    if (cardtemplates[0].elementname.includes(' ')) {
        cardtemplates[0].elementname = cardtemplates[0].elementname.replaceAll(' ', '_') 
        cardtemplates[0].counterid = cardtemplates[0].counterid.replaceAll(' ', '_')

    }

    localsave.push(cardtemplates[0])


    let taskcard = createTaskCategoryCard(cardtemplates[0])
        if (taskcard) {  
            cardtemplates.push(taskcard)
        }
  
       
    dateclass(cardtemplates[0].date, cardtemplates[0]) 
    createcards.createcard(cardtemplates)
    createButtons(cardtemplates[0].id, cardtemplates[0].elementname, cardtemplates[0].checkmark)

    let parentdiv = document.getElementById(cardtemplates[0].id).parentElement
    let counterparentdiv = document.getElementById(cardtemplates[0].counterid).parentElement

    counterparentdiv.id = cardtemplates[0].counterid + 'div'
    parentdiv.classList.add(cardtemplates[0].class)
    for (const entry of parentdiv.children ) {
        entry.classList.add(cardtemplates[0].class)
    }

    entrycounter()

    saveToLocalStorage(localsave)

})

//Takes a template of one of the tasks and produces a labeled button and div for the counter to be placed in. If it already exists instead updates the button text to the new one.
function createTaskCategoryCard(cardtemplates) {

    const taskcategorycard = {
        'elementname': cardtemplates.counterid,
        'elementtype': 'h3',
        'category': "categorydiv",
        'id': cardtemplates.counterid,
        'value': cardtemplates.elementname,
        'text': cardtemplates.elementname.replace('_', ' ')
    }

    let taskcardtemplatecheck = document.getElementById(taskcategorycard.id)

    if (taskcardtemplatecheck) {
        taskcardtemplatecheck.textContent = taskcategorycard.elementname.replace('_', ' ')
        return
    } else {
        localsave.push(taskcategorycard)
        return taskcategorycard
    }

}

//Takes the target element and elementname from a card template then adds the edit button and checkbox to it, the delete button is handled by the card creator itself.
function createButtons(targetelement, elementname, checkmark) {
    
    let createcheckbox = document.createElement('input')
    let editbutton = document.createElement('button')
    let edittarget = document.getElementById(targetelement).parentElement
    let checkboxtarget = document.getElementById(targetelement).nextElementSibling
  
    editbutton.classList.add('editbutton', elementname, 'button')
    
   

    editbutton.textContent = 'Edit'
 
    edittarget.appendChild(editbutton)
 
    createcheckbox.classList.add('checkbox', elementname, 'completestatus')
    createcheckbox.setAttribute('type', 'checkbox')
    if (checkmark === 'true') {
        createcheckbox.setAttribute('checked', 'checked')
    }
    edittarget.insertBefore(createcheckbox, checkboxtarget)
 }

 //Parses the date and updates the templates class value to the one fitting the schedule categories.
 function dateclass(enddate, targetObject) {
        
    if (isNaN(Date.parse(enddate))) {
        console.error('Invalid date input. Please provide a valid date.');
        return;
    }

    let startDate = new Date()

    let endDate = new Date(enddate)

    let dateparse = (endDate.getTime() - startDate.getTime()) / 1000

    switch (true) {
        case (dateparse <= 86400 && dateparse > 0):
            targetObject.class = 'today';
            break;
        case (dateparse <= 604800 && dateparse > 0):
            targetObject.class = 'thisweek';
            break;
        case (dateparse <= 2592000 && dateparse > 0):
            targetObject.class = 'thismonth';
            break;
        case (dateparse <= 31536000 && dateparse > 0):
            targetObject.class = 'thisyear';
            break;
        case (dateparse > 31536000 && dateparse > 0):
            targetObject.class = 'beyondyear';
            break;
        case (dateparse <= 0):
            targetObject.class = 'pastdue';
            break;
    }
}

//Loops through localsave looking to matching counterids and scheduleids to update or delete the relevant counters.
function entrycounter() {
  
    let counteridfilter =  (localsave.filter((v) => v.category === 'categorydiv'))  

    for (const counter of counteridfilter) {
        let categorycontentcount = localsave.filter((v) => v.elementname === counter.value).length;
        let countercardcheck = document.getElementById(counter.id + 'counternum');

        if (countercardcheck) {
            if (categorycontentcount <= 0) {
                let localcheckforcounter = localsave.findIndex(entry => entry.id === counter.id);
                if (localcheckforcounter !== -1) {
                    localsave.splice(localcheckforcounter, 1);
                    countercardcheck.parentElement.remove();
                }
            } else {
                countercardcheck.textContent = categorycontentcount;
            }
        } else {
            let countertemplate = {
                'elementname': counter.id,
                'category': counter.id + 'div',
                'elementtype': 'h3',
                'text': 0,
                'value': counter.value
        };
        let headerelement = document.createElement('h3');
        let targetdiv = document.getElementById(counter.id).parentElement;
        let targetdivchild = targetdiv.firstElementChild;
        targetdivchild.classList.add('counterbutton', counter.elementname);
        targetdiv.classList.add('counterbutton', counter.elementname);
        headerelement.classList.add('categorydiv', countertemplate.category, countertemplate.elementname, 'headercontent', 'counter', 'counterbutton', counter.elementname);
        headerelement.textContent = 0;
        headerelement.setAttribute('id', counter.id + 'counternum');
        headerelement.setAttribute('data-value', counter.value);
        targetdiv.appendChild(headerelement);
        headerelement.textContent = categorycontentcount;
    }
}

                const categoryCounterMap = {
                    'today': 'todaycounter',
                    'thisweek': 'thisweekcounter',
                    'thismonth': 'thismonthcounter',
                    'thisyear': 'thisyearcounter',
                    'beyondyear': 'beyondyearscounter',
                    'pastdue': 'pastduecounter'
                }


                const categoryCounts = {}
                for (const category in categoryCounterMap) {
                    categoryCounts[category] = localsave.filter((v) => v.class === category).length
                    const targetCounter = document.getElementById(categoryCounterMap[category])

                    if (categoryCounts[category] >= 1) {
                        targetCounter.textContent = categoryCounts[category]
                    } else {
                        targetCounter.textContent = '0'
                    }
                }
                function updateHomeCounter(localsave) {
                    let homecounter = document.querySelector('#homecounter');
                    const homecount = localsave.filter((v) => v.category === 'content').length;
                    homecounter.textContent = homecount;
                }

                updateHomeCounter(localsave)

}

//Listens for click on the counters then clears the content and regenerates the templates that match the button's value.
sidebar.addEventListener('click', (event) => {
    if (event.target.classList.contains('counterbutton')) {
        let filtertarget;

        if (event.target.classList.contains('homecounter')) {
            filtertarget = localsave.filter((v) => v.button === 'Delete');
        } else if (event.target.classList.contains('scheduledivitems')) {
            filtertarget = localsave.filter((v) => v.class === event.target.dataset.value);
        } else if (event.target.classList.contains('categorydiv')) {
            filtertarget = localsave.filter((v) => v.elementname === event.target.dataset.value);
        }

        contentcontainer.innerHTML = '';

        if (filtertarget && filtertarget.length > 0) {
            createcards.createcard(filtertarget);
            filtertarget.forEach((entry) => {
                if (entry.category !== 'categorydiv') {
                    createButtons(entry.id, entry.elementname, entry.checkmark);
                }
            });
        }
    }

        editwindow.style.display = "none";

});

//Holding object for the submit button listener to get the data it needs.
let dataforedit = {
    'targetdiv':'',
    'texttarget': '',
    'classes': '',
    'id': '',
    'localindex': '',
}

//Depending which button click brings up the edit window and updates dataforedit for the submit listener to use. Or if click delete it deletes the containing content and removes it's entry in localsave.
contentcontainer.addEventListener('click', (event) => {
    let targetdiv = event.target.parentElement
    let ObjectToEditID = event.target.parentElement.firstChild.id
    let TargetObjectIndex
 
    for (const entry of localsave) {
        if (entry.id === ObjectToEditID) {
            TargetObjectIndex = localsave.indexOf(entry)
        }
    }

    if (event.target.classList.contains('editbutton') ) {
        let edittextform = document.getElementById('edittext')
        let editdateform = document.getElementById('editdate')
        let editstatus = document.getElementById('editstatus')
        let editelementname = document.getElementById('editelementname')

        editelementname.value = localsave[TargetObjectIndex].elementname.replaceAll('_', ' ')

        edittextform.value = localsave[TargetObjectIndex].text
        editstatus.value = localsave[TargetObjectIndex].status
        editdateform.value = localsave[TargetObjectIndex].unformateddate

        editwindow.style.display = "flex";

        dataforedit.targetdiv = targetdiv
        dataforedit.texttarget = targetdiv.querySelector('p')
        dataforedit.classes = dataforedit.texttarget.getAttribute('class') 
        dataforedit.id = ObjectToEditID
        dataforedit.localindex = TargetObjectIndex
      

        return
    }


   
    function deleteEntry(index) {
        if (localsave[index].category !== 'categorydiv' && targetdiv) {
            targetdiv.classList.toggle('removed', true);
            targetdiv.remove()
            localsave.splice(index, 1);
            entrycounter();
        }

    }

    TargetObjectIndex = localsave.findIndex(entry => entry.id === ObjectToEditID);
    if (event.target.classList.contains('deletebutton') && localsave.length > 0) {
        deleteEntry(TargetObjectIndex)
    }

    if (event.target.classList.contains('completestatus')) {

        if (event.target.checked) {        
        localsave[TargetObjectIndex].checkmark = 'true'
    } else {
        localsave[TargetObjectIndex].checkmark = 'false'
    }
}


    saveToLocalStorage(localsave)





})

//Takes the data from above alongwith localsave to edit the values and counters if anything changed.
editformsubmit.addEventListener('submit', (event) => {
    event.preventDefault()
    editwindow.style.display = "none";


    function sanitizeInput(input) {
        const tempDiv = document.createElement('div');
        tempDiv.textContent = input;
        return tempDiv.innerHTML;
    }
    
    let edittextform = document.getElementById('edittext') ? sanitizeInput(document.getElementById('edittext').value.trim()) : '';
    let editdateform = document.getElementById('editdate') ? sanitizeInput(document.getElementById('editdate').value.trim()) : '';
    let editstatus = document.getElementById('editstatus') ? sanitizeInput(document.getElementById('editstatus').value.trim()) : '';
    let editelementname = document.getElementById('editelementname') ? sanitizeInput(document.getElementById('editelementname').value.trim()) : '';

    let formattedelementname = editelementname
    
    localsave[dataforedit.localindex]
    if (editelementname.includes(' ')) {
        formattedelementname = editelementname.replaceAll(' ', '_')
    }    
  

    if (localsave[dataforedit.localindex].elementname !== formattedelementname || localsave[dataforedit.localindex].text !== edittextform || localsave[dataforedit.localindex].unformateddate !== editdateform ||  localsave[dataforedit.localindex].status !== editstatus) {
  
        let oldtaskelementname = localsave[dataforedit.localindex].elementname
        let newtaskelementname = formattedelementname
      

        if (localsave[dataforedit.localindex].elementname !== formattedelementname) {
            localsave[dataforedit.localindex].elementname = formattedelementname


            document.getElementById(localsave[dataforedit.localindex].counterid).parentElement.classList.remove(localsave[dataforedit.localindex].counterid)

            document.getElementById(localsave[dataforedit.localindex].counterid).parentElement.classList.add('taskcategorycard' + formattedelementname)
         
            
            for (const entry of document.getElementById(localsave[dataforedit.localindex].counterid).parentElement.children) {
                entry.classList.remove(localsave[dataforedit.localindex].counterid)
                entry.classList.add('taskcategorycard' + formattedelementname)
            }

            dataforedit.targetdiv.classList.remove(oldtaskelementname)
            dataforedit.targetdiv.classList.add(newtaskelementname)
            localsave[dataforedit.localindex].counterid = 'taskcategorycard' + formattedelementname

                      for (const entry of dataforedit.targetdiv.children ) {
                entry.classList.remove(oldtaskelementname)
                entry.classList.add(newtaskelementname)
            }

           
           
            for (const entry of localsave) {
                if (entry.elementname === localsave[dataforedit.localindex].counterid ) {
    
                    let taskcard =         createTaskCategoryCard(localsave[dataforedit.localindex])

                    if (taskcard) {  
                        createcards.createcard(taskcard)
                    }
                 

                    entrycounter()  
    
                    return
                } 
            }


            let taskcard =         createTaskCategoryCard(localsave[dataforedit.localindex])

            if (taskcard) {  
                createcards.createcard(taskcard)
            }

        }
  
        if (localsave[dataforedit.localindex].text !== edittextform) {
            localsave[dataforedit.localindex].text = edittextform
            dataforedit.texttarget.textContent = `${edittextform} Date: ${format(editdateform,'Pp')}`
        }
       
        if (localsave[dataforedit.localindex].unformateddate !== editdateform) {
            localsave[dataforedit.localindex].unformateddate = editdateform
            localsave[dataforedit.localindex].date = format(editdateform,'Pp')
            dataforedit.targetdiv.classList.remove('today', 'thisweek', 'thismonth', 'thisyear', 'beyondyear', 'pastdue')
            for (const entry of dataforedit.targetdiv.children ) {
                entry.classList.remove('today', 'thisweek', 'thismonth', 'thisyear', 'beyondyear', 'pastdue')
            }
            dateclass(localsave[dataforedit.localindex].date, localsave[dataforedit.localindex]) 
            dataforedit.texttarget.textContent = `${edittextform} Date: ${format(editdateform,'Pp')}`  
            dataforedit.targetdiv.classList.add(localsave[dataforedit.localindex].class)
            for (const entry of dataforedit.targetdiv.children ) {
                entry.classList.add(localsave[dataforedit.localindex].class)}
        }

        
        if (localsave[dataforedit.localindex].status !== editstatus) {
            localsave[dataforedit.localindex].status = editstatus
            dataforedit.texttarget.classList.remove('high', 'medium', 'low')
            dataforedit.targetdiv.classList.remove('high', 'medium', 'low')
            dataforedit.texttarget.classList.add(editstatus)
            dataforedit.targetdiv.classList.add(editstatus)
          }


          for (const entry of localsave) {
            if (entry.elementname !== localsave[dataforedit.localindex].counterid ) {           


                entrycounter()  
                return
            } 
        }
   
    }

  
    editwindow.style.display = "none";
    saveToLocalStorage(localsave)

})

document.addEventListener('DOMContentLoaded', () => {
    const elements = document.querySelectorAll('.categorydiv, .scheduledivitems, .homecounter');

    elements.forEach(element => {
        element.addEventListener('click', () => {
            // Remove 'selected' class from all elements
            elements.forEach(el => el.classList.remove('selected'));
            
            // Add 'selected' class to the clicked element
            element.classList.add('selected');
        });
    });
});