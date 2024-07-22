import { z } from "zod";

export const UserFormValidation = z.object({
  name: z.string()
    .min(2, { message: "Name must be at least 2 characters." })
    .max(50, { message: "Name must be at most 50 characters." }),
  email: z.string().email({ message: "Invalid email." }),
  phone: z.string().refine((phone) => /^\+\d{10,15}$/.test(phone), {
    message: "Invalid number."
  })
});

export default UserFormValidation;
