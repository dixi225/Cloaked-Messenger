import z from 'zod'

export default z.object({
    email : z.string().email({message:"Enter valid email"}),
    password: z.string().min(8,{message:"password should be atleast of 8 lengths"})
})