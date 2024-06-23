let forminputs = {
    'sanitizeforminput': function sanitizeInput(input) {
        const tempDiv = document.createElement('div');
        tempDiv.textContent = input;
        return tempDiv.innerHTML;
    },        

 
    'formobject': function formvaluesobject(targetform) {  

        let formvaluesobject = {}    
        const inputtarget = targetform.querySelectorAll('input, select')
  
        for (const input of inputtarget) {
            if (input.id) {
                formvaluesobject[input.id] = input ? forminputs.sanitizeforminput(input.value.trim()) : '';
            }
            formvaluesobject[input.id] = input.value;
        }

        return formvaluesobject  

    },

    'forminputids': function forminputids(targetform) {
        let forminputids = []
    
        const inputtarget = targetform.querySelectorAll('input, select')
  
        for (const input of inputtarget) {
            if (input.id) {
                forminputids[input.id] = input ? forminputs.sanitizeforminput(input.value.trim()) : '';
            }
            forminputids[input.id] = input.value;
        }


        return forminputids
    },   

    'forminputvalues': function forminputvalues(targetform) {
        let forminputvalues = []
    
        const inputtarget = targetform.querySelectorAll('input, select')

  
        for (const input of inputtarget) {
            if (input.id) {
                forminputvalues[input.value] = input ? forminputs.sanitizeforminput(input.value.trim()) : '';
            }
            forminputvalues[input.value] = input.value;
        }

        return forminputvalues
    },  
    
}

export default forminputs
