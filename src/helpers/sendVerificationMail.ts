import { resend } from "@/lib/resend";
import VerificationEmail from "../emails/verificationMail"
import apiResponse from "@/types/apiResponse";
export async function sendVerifcationMail(email:string,username:string,otp:string):Promise<apiResponse>{
    try{
      await resend.emails.send({
          from:"onboarding@resend.dev",
          to: email,
          subject:"Cloaked Messenger Verification Code",
          react:VerificationEmail({username,otp})
      })
      return{
        success:true,
        message:"Verifiaction email sent"
      }
    }catch(emailError){
      console.log(emailError)
      return{
        success:false,
        message:"Faced some error while sending mail"
      }
    }
}