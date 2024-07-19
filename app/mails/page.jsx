import { Button } from 'antd';
import { sendMail } from '@lib/Mail';
import React from 'react'

function page() {

    const send = async () => {
       await sendMail("tumronald1@gmail.com",
        "Testing",
        "<p>Hello World</p>",
      );   
    };  
    send();
  return (
    <div>
      <form action="" method="post">
        <Button > Click me </Button>  
      </form>
    </div>
  )
}

export default page
