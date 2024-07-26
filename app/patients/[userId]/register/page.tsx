import RegisterForm from "@/components/forms/RegisterForm";
import { getUser } from "@/lib/actions/patient.actions";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export const Register = async ({ params: { userId } }: SearchParamProps) => {
  const user = await getUser(userId);

  return (
    <div className="flex h-screen max-h-screen">
      <section className="remove-scrollbar container">
        <div className="sub-container max-w-[860px] flex-1 flex-col py-10">
          <div className="flex align-center">
            <Image
              src="/assets/images/logo-gl.jpg"
              height={1000}
              width={1000}
              alt="patient"
              className="mb-12 h-10 w-fit rounded-md"
            />
            <h3 className="ml-2.5">CareSet</h3>
          </div>

          <RegisterForm user={user} />

          <p className="copyright py-12 flex justify-start">© 2024 CareSet</p>
        </div>
      </section>
      <Image
        src="/assets/images/register-img.png"
        height={1000}
        width={1000}
        alt="Patient"
        className="side-img max-w-[390px]"
      />
    </div>
  );
};

export default Register;
