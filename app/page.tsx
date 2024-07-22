import PatientForm from "@/components/forms/PatientForm";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex h-screen max-h-screen">
      <section className="remove-scrollbar container my-auto">
        <div className="sub-container max-w-[496px]">
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
         

          <PatientForm />

          <div className="text-14-regular mt-20 flex justify-between">
            <p className="justify-items-end text-dark-600 xl:text-left">
              © 2024 CareSet
            </p>
            <Link href="/?admin=true" className="text-green-500">Admin</Link>
          </div>
        </div>
      </section>
      <Image 
      src="/assets/images/doctor-img.jpg"
      height={1000}
      width={1000}
      alt="Patient"
      className="side-img max-w-[50%]"
      />
    </div>
  );
}
