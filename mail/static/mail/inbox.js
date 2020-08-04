document.addEventListener('DOMContentLoaded', function() {

  

  // Use buttons to toggle between views
  document.getElementById('inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.getElementById('compose').addEventListener('click', compose_email);
  document.getElementById('sent').addEventListener('click', () => load_mailbox('sent'));
  document.getElementById('archive').addEventListener('click', () => load_mailbox('archive'));
  document.getElementById('compose').addEventListener('click', compose_email);
  // By default, load the inbox
  load_mailbox('inbox');
});

//function to open mail 
function openmail(mail){
  //display emailss and hide other views
    document.querySelector('#emails-view').style.display = 'none';
    document.querySelector('#compose-view').style.display = 'none';
    document.querySelector('#emailss').style.display = 'block';
    
    //fecth email based on id provided when clicking in that email
    fetch(`/emails/${mail.dataset.id}`)
    .then(response => response.json())
    .then(email => {
      
      // check if the email is send by the user or not
      if (email.sender=== `${mail.dataset.sender}`){
        document.querySelector('#emailss').innerHTML= `
        <div class="card open shadow p-3 mb-5 bg-white rounded" id=${email.id} >
    <div class="card-body" >
      <h5 class="card-title">${email.subject} </h5>  
      <span class=time> ${email.timestamp}  </span> <br>
      <p class="card-text"> From : ${email.sender} <br>  <br>
      To :  ${email.recipients} <br>
      <hr>
      <pre> <span class="pre">${email.body} </span> </pre>  <hr> 
      <button type="button" onclick=replymail(this) data-id=${mail.dataset.id} data-sender=${mail.dataset.sender} class="btn btn-outline-secondary"> <i class="fa fa-reply"></i> Reply </button> 
     
      </p>
   
      
    </div>
  
  
        
        </div>`;

      }
      //if not then add an archive or unarchibe button
      else{
        
        //check whether the mail is archived or not and unarchive button for archived mail and archive button for unarchived mail
        if (email.archived===false)
        {

        

      
      document.querySelector('#emailss').innerHTML= `
      <div class="card open shadow p-3 mb-5 bg-white rounded" id=${email.id}>
  <div class="card-body" >
    <h5 class="card-title">${email.subject} </h5>  
    <span class=time> ${email.timestamp}  </span>
    <p class="card-text"> From : ${email.sender} <br> <br>
    To :  ${email.recipients} <br>
    <hr>
    
    <pre> <span class="pre">${email.body} </span> </pre>  <hr> 
    <button type="button" onclick=replymail(this) data-id=${mail.dataset.id} data-sender=${mail.dataset.sender} class="btn btn-outline-secondary"> <i class="fa fa-reply"></i> Reply </button> 
    <span class="time"> <button type="button" onclick=archivemail(this) data-id=${mail.dataset.id} class="btn btn-outline-secondary "> <i style="font-size:14px" class="fa ">&#xf187;</i></i> Archive </button>  </span>
    
    </p>
    
  </div>


      
      </div>`;
        }
        else
        {
          document.querySelector('#emailss').innerHTML= `
          <div class="card open shadow p-3 mb-5 bg-white rounded"  id=${email.id}>
      <div class="card-body ">
        <h5 class="card-title">${email.subject} </h5>  
        <span class=time> ${email.timestamp}  </span>
        <p class="card-text"> From : ${email.sender} <br> <br>
        To :  ${email.recipients} <br>
        <hr>
        <pre> <span class="pre">${email.body} </span> </pre>   <hr> 
        <button type="button" onclick=replymail(this) data-id=${mail.dataset.id} data-sender=${mail.dataset.sender} class="btn btn-outline-secondary"> <i class="fa fa-reply"></i> Reply </button> 
        <span class="time"> <button type="button" onclick=archivemail(this) data-id=${mail.dataset.id} class="btn btn-outline-secondary "> <i style="font-size:14px" class="fa ">&#xf187;</i></i> Unarchive </button>  </span>
        
        </p>
        
      </div>
    
    
          
          </div>`;
        }
      }
  
     
  });   
 // marked email as read after it is opened
    fetch(`/emails/${mail.dataset.id}`, {
      method: 'PUT',
      body: JSON.stringify({
          read: true
      })
      
    });
   
     
  
  }

  //function to archive or unarchive a mail

function archivemail(mail){
    document.querySelector('#emails-view').style.display = 'none';
    document.querySelector('#compose-view').style.display = 'none';
    document.querySelector('#emailss').style.display = 'block';

    //retrive the mail that is being archived or unarchived based on its id 
  
    const amail=document.getElementById(`${mail.dataset.id}`);
    amail.style.animationPlayState = 'running';
    console.log(amail)
  // run the animation when a mail is archive or unarchive
   
  
    //archive or unarchive an email
    fetch(`/emails/${mail.dataset.id}`)
    .then(response => response.json())
    .then(email => {
      //if email not archive then archive the mail
    if (email.archived===false){
      console.log(mail.dataset.id)
      fetch(`/emails/${email.id}`, {
        method: 'PUT',
        body: JSON.stringify({
            archived: true
        })
     
      })
     // set time delay to load inbox
      setTimeout(function(){
        location.reload();


      }, 1000); 
    
    }
    else{
      //unarchive the email if it is already archived
      
      fetch(`/emails/${email.id}`, {
        method: 'PUT',
        body: JSON.stringify({
            archived: false
        })
      })
     
     
      setTimeout(function(){
        location.reload();


      }, 1000); 
    
    }
  });

 

  }

  //function to reply back mail


  function replymail(mail){
    
    document.querySelector('#emails-view').style.display = 'none';
    document.querySelector('#compose-view').style.display = 'block';
    document.querySelector('#emailss').style.display = 'none';
    document.querySelector('#error').innerHTML = '';
    fetch(`/emails/${mail.dataset.id}`)
    .then(response => response.json())
    .then(email => {
      
      // if the email is sent by us then recipients should be the one we send email to
   
      
      if (email.sender=== `${mail.dataset.sender}`) {
        document.getElementById('compose-recipients').value=email.recipients;

      }
       // if the email is sent to us then recipients should be the one that send email to us
      else {
      document.getElementById('compose-recipients').value=email.sender;
      }
      //prefill the body 
      document.getElementById('compose-body').value=`On ${email.timestamp} ${email.sender} wrote : ${email.body}`;
      //if subject includes RE the dont place Re 
      if (email.subject.includes('Re')===true)
      {
        document.getElementById('compose-subject').value=`${email.subject}`;
      }
      else
      {
        document.getElementById('compose-subject').value=` Re:${email.subject}`;
      }
      
      
  
      
  }); 
  //on clicking reply button send the email
  document.querySelector('form').onsubmit = function() {
    const recipients = document.querySelector('#compose-recipients').value
    const subject = document.querySelector('#compose-subject').value
    const body = document.querySelector('#compose-body').value
    
  fetch('/emails', {
    method: 'POST',
    body: JSON.stringify({
        recipients: `${recipients}`,
        subject: `${subject}`,
        body: `${body}`
    })
  })
  .then(response => response.json())
  .then(result => {
      // if there is any  error while sending mail
  if (result.error!==undefined){
    console.log(result.error)
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
  document.querySelector('#error').innerHTML = `<div class="alert alert-danger"> ${result.error}</div>`;

  
  }
  else
   // if there is not any  error while sending mail
  {
    console.log(result.message)
    document.querySelector('#compose-recipients').value = '';
    document.querySelector('#compose-subject').value = '';
    document.querySelector('#compose-body').value = '';
    

    
//load sent section when the email is succesfully sent
    load_mailbox('sent');


  }
  });

  
  return false;
}

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';

  

  }
    

   



function compose_email() {

  // Show compose view and hide other views

  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';
  document.querySelector('#emailss').style.display = 'none';
  // rename the section as following when compose is selected
  document.getElementById('inbox').innerHTML='Inbox';
  document.getElementById('sent').innerHTML='Sent';
  document.getElementById('archive').innerHTML='Archive';
  document.getElementById('error').innerHTML='';


  //pass api to compose mail
  document.querySelector('form').onsubmit = function() {
    const recipients = document.querySelector('#compose-recipients').value
    const subject = document.querySelector('#compose-subject').value
    const body = document.querySelector('#compose-body').value
  fetch('/emails', {
    method: 'POST',
    body: JSON.stringify({
        recipients: `${recipients}`,
        subject: `${subject}`,
        body: `${body}`
    })
  })
  .then(response => response.json())
  .then(result => {
      // if there is any  error while sending mail
  if (result.error!==undefined){
    //display the error messgae
    var error=document.getElementById('error');
  
  error.innerHTML=`<div class="alert alert-danger"> ${result.error}</div>`;
  
  
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
  
  }
  else
   // if there is not any  error while sending mail
  {
    console.log(result.message);
    

    document.querySelector('#compose-recipients').value = '';
    document.querySelector('#compose-subject').value = '';
    document.querySelector('#compose-body').value = '';

    //load sent section when the email is succesfully sent
    

    load_mailbox('sent');
   
    
  
  


  }
  });

  
  return false;
}

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

// function to load inbox,sent or archive 

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#emailss').style.display = 'none';
  // Show the mailbox name
document.querySelector('#emails-view').innerHTML = `  <h3> &nbsp; ${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
// run this section to bold the mailbox name that has been selected
var mails=["inbox","sent","archive"];
var i;
for (i=0;i<mails.length;i++) {
  if (mailbox===mails[i]){
    document.getElementById(`${mails[i]}`).innerHTML=`  <strong> ${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</strong>`;

  }
  else{
    document.getElementById(`${mails[i]}`).innerHTML=`${mails[i].charAt(0).toUpperCase() +mails[i].slice(1)}`;

  }
}


//fetch the mailbox selected
fetch(`/emails/${mailbox}`)
.then(response => response.json())
.then(emails => {
   emails.forEach(function(emails){
    document.querySelector('#emails-view').style.display = 'block';
    document.querySelector('#compose-view').style.display = 'none';
    document.querySelector('#emailss').style.display = 'none';
    // save the details of mail 
    id=emails['id'];
    recipients=emails['recipients'];
    sender=emails['sender'];
    subject=emails['subject'];
    body=emails['body'];
    read=emails['read'];
    archive=emails['archived'];
    timestamp=emails['timestamp'];
    //if mailbox is sent dont display archive button
    if (mailbox==='sent'){
      const element = document.createElement('div');
      element.className="card main"
      element.innerHTML = `<div class=card-body onclick=openmail(this) data-id=${id} data-sender=${sender}>  
      <p class=mail ><strong> To: ${recipients} </strong> ${subject} <span class=time>
      ${timestamp}</span> </p> `;
      document.querySelector('#emails-view').append(element);
    }
    else
    {
      // if mail is not archived then dispay archived button
    if (archive===false)
    {
      //if mail is already read
    if (read===true)
    {

    const element = document.createElement('div');
    element.className="card main";
  
    element.innerHTML = `
   
  <div class=card-body onclick=openmail(this) data-id=${id}>
  <p class=mail  ><strong> ${sender} </strong> ${subject} 
  <span class=time>
   ${timestamp}</span> </p>
   `;
    document.querySelector('#emails-view').append(element);
    }
    else
      {
//change the background ofr unread mails to gray
        const element = document.createElement('div');
        element.className="card unread main";
        
        element.innerHTML = `<div class=card-body  onclick=openmail(this) data-id=${id}>
        <p class=mail  ><strong> ${sender} </strong> ${subject} 
        <span class=time>
         ${timestamp}</span> </p>`
         
        document.querySelector('#emails-view').append(element);

      }
    }
    else{
      //if archived is true the display unarchive button
      
      if (read===true)
      {
  
        const element = document.createElement('div');
        element.className="card main";
        
       
        element.innerHTML = `<div class=card-body onclick=openmail(this) data-id=${id}  >
        <p class=mail ><strong> ${sender} </strong> ${subject} 
        <span class=time>
         ${timestamp}</span> </p>`
         
        document.querySelector('#emails-view').append(element);

      }
      else
        {
  // if mail is not read change the background of card to grey
          const element = document.createElement('div');
          element.className="card unread main";
          //element.setAttribute("id", `${id}`);
          element.innerHTML = `<div class=card-body  onclick=openmail(this) data-id=${id}>
          <p class=mail  ><strong> ${sender} </strong> ${subject} 
          <span class=time>
           ${timestamp}</span> </p>
          `
          document.querySelector('#emails-view').append(element);
  
        }
      }
  }

   })
       
      
   // ... do something else with emails ...
});
}
