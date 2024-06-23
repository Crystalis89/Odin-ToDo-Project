let createcards = {

/*Quick list of accepted template types:
h1 through h5
p for paragraph
div for a div
button for a button
delete (can have any value) to give button deletebutton class
category, this is used for targeting where the element will be put
elementname, used for classes
text, text to be added to element
id to give it a specific id instead of a random generated one
class to add a single class, haven't worked out how to make it take more than one
value adds it contents to value for button or data-value for other element types
*/


    'cardcontents': [

          //  Header and Paragraph element template examples, should be able to easily expand it to other elements later.
       
      // {
      //    'elementname':'firstentry',
      //    'category': 'content',
      //    'elementtype': 'p',
      //    'text': 'Trying to create the new content entry',
      //    'id': 'firstentryid',
      //   'classes': 'test',
      //   //  'delete': 'yes'
      // },
      // {
      //   'elementname': 'headerncontent1',
      //   'category': 'categoryfolder',
      //   'elementtype': 'h1',
      //   'text': 'Content Header Test 1'
      //  },
      //  {
      //   'elementname': 'headerncontent2',
      //   'category': 'content',
      //   'elementtype': 'h2',
      //   'text': 'Content Header Test 2'
      //  },
      //  {
      //       'elementname': 'headerncontent2',
      //       'category': 'content',
      //       'text': 'Delete',
      //       'delete': 'yes',
      //       'button': 'Delete'
      //  },
      //  {
      //   'elementname': 'headerncontent3',
      //   'category': 'content',
      //   'elementtype': 'h3',
      //   'text': 'Content Header Test 3 '
      //  },
      //  {
      //   'elementname': 'headerncontent4',
      //   'category': 'content',
      //   'elementtype': 'h4',
      //   'text': 'Content Header Test 4 '

      //  },
      //  {
      //   'elementname': 'headerncontent5',
      //   'category': 'content',
      //   'elementtype': 'h5',
      //   'text': 'Content Header Test 5'
      //  },

      
  ],

  'createcard': function createcard(objectsforcard) {

  

    if (objectsforcard) {      
        if (objectsforcard.length > 0) {

            for (const inputs of objectsforcard) {
                createcards.cardcontents.push(inputs)

        }
        } else {
            createcards.cardcontents.push(objectsforcard)
        }
       
        } else {alert('Error Need Input')}


        for (const element of this.cardcontents) {
            let category = element.category
            let status = element.status
            let elementname = element.elementname
            let elementid = element.id
            let elementclass = element.class
            let elementvalue = element.value      


            let targetdiv = document.getElementById(category)
            let text
              
            let divelement = document.createElement('div')

            if (element.status) {
                divelement.classList.add(category, elementname, "divcontent", status)
            } else if (element.class) {
              divelement.classList.add(category, elementname, "divcontent", status, elementclass)
            }else {
                divelement.classList.add(category, elementname, "divcontent")          
              }
            
              divelement.setAttribute('id', crypto.randomUUID())

              if (element.value) {
              divelement.setAttribute('data-value', elementvalue)  
              }
            
            
              if (element.price) {
                  text =  `${element.text} Price ${element.price}`
                  } else if (element.date) {
                  text =  `${element.text} Date: ${element.date}`
                  }
                  else {
                  text = element.text     
                  }
              
              //depending what elementtype is
    
              if (element.elementtype === 'div') {
                
                let innerdiv = document.createElement('div')
                innerdiv.classList.add(category, elementname, "innerdiv")

                if (element.id) {
                    innerdiv.setAttribute('id', elementid)    
                } else {
                  innerdiv.setAttribute('id', crypto.randomUUID())  
                }

                if (element.value) {
                  innerdiv.setAttribute('data-value', elementvalue)
                }

                divelement.appendChild(innerdiv)

              }

            if (element.elementtype === 'unorderedlist') 
              {
                let unorderedlist = document.createElement('ul')

                unorderedlist.classList.add(category, elementname, 'unorderedlist')


                if (element.id) {
                  unorderedlist.setAttribute('id', elementid)    
                } else {
                    unorderedlist.setAttribute('id', crypto.randomUUID())  
                }

                if (element.value) {
                  unorderedlist.setAttribute('data-value', elementvalue)
                }

                divelement.appendChild(unorderedlist)
                  
              }
                


            if (element.elementtype === 'listitem') {

              let listitem = document.createElement('li')


              listitem.classList.add(category, elementname, 'listitem')


              if (element.id) {
                listitem.setAttribute('id', elementid)    
              } else {
                  listitem.setAttribute('id', crypto.randomUUID())  
              }

              if (element.text) {
                listitem.textContent = text
              }
              
              if (element.value) {
                listitem.setAttribute('data-value', elementvalue)
              }

              divelement.appendChild(listitem)
              
            
            }
          
              if (element.elementtype === 'h1' || element.elementtype === 'h2' || element.elementtype === 'h3'|| element.elementtype === 'h4'|| element.elementtype === 'h5') {
                let headertype = element.elementtype

                let headerelement = document.createElement(headertype)
    
                headerelement.removeAttribute('class')
                headerelement.classList.add(category, elementname, 'headercontent')
    
                headerelement.textContent = element.text   
                if (element.id) {
                        headerelement.setAttribute('id', elementid)
                }  else {
                  headerelement.setAttribute('id', crypto.randomUUID())  
                }
                if (element.value) {
                  headerelement.setAttribute('data-value', elementvalue)
                }

                divelement.appendChild(headerelement)
    
              }
    
             
    
              if (element.elementtype === 'p') {
                let paraelement = document.createElement('p')
    
                  paraelement.removeAttribute('class')
    
                  if (element.status) {                    
                    paraelement.classList.add(category, elementname, "textcontent", status)
                  }                   
                  if (element.class) {
                    paraelement.classList.add(category, elementname, "textcontent", status, elementclass)
                  } else {
                    paraelement.classList.add(category, elementname, "textcontent")          

                  }

              

                paraelement.textContent = text
                
             
                if (element.id) {
                    paraelement.setAttribute('id', elementid)
                }  else {
                   paraelement.setAttribute('id', crypto.randomUUID())  
                }

                if (element.value) {
                  paraelement.setAttribute('data-value', elementvalue)
                }

                divelement.appendChild(paraelement)
    
            }

            if (element.button) {
                //Likely need to build a seperate function to actually do the removing on click, since it just relying on checking if the listened button has the right class it should be easy to do and add it to the module.
                let button = document.createElement('button')

                if (element.delete) {
                    button.classList.add(category, elementname, "deletebutton")
                } else {
                    button.classList.add(category, elementname, "button")
                    if (element.id) {
                      button.setAttribute('id', elementid)
                    } else {
                        button.setAttribute('id', crypto.randomUUID())  
                    }
                }

                button.textContent = element.button
              

                if (element.value) {
                  button.setAttribute('data-value', elementvalue)
                }

                divelement.appendChild(button)
            }


     targetdiv.appendChild(divelement)
    
          }
    this.cardcontents.length = 0
 

  },


}


export default createcards
