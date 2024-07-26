"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl } from "@/components/ui/form";
import CustomFormField from "../CustomFormField";
import SubmitButton from "../SubmitButton";
import { useState } from "react";
import PatientFormValidation from "@/lib/validation";
import { useRouter } from "next/navigation";
import { createUser, registerPatient } from "@/lib/actions/patient.actions";
import { FormFieldType } from "./PatientForm";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import {
  Doctors,
  GenderOptions,
  IdentificationTypes,
  PatientFormDefaultValues,
} from "@/constants";
import { Label } from "../ui/label";
import { SelectItem } from "../ui/select";
import Image from "next/image";
import FileUploader from "../FileUploader";
import { Router } from "lucide-react";

const RegisterForm = ({ user }: { user: User }) => {
  const router = useRouter();
  const [isLoading, setisLoading] = useState(false);

  const form = useForm<z.infer<typeof PatientFormValidation>>({
    resolver: zodResolver(PatientFormValidation),
    defaultValues: {
      ...PatientFormDefaultValues,
      name: "",
      email: "",
      phone: "",
    },
  });

  async function onSubmit(values: z.infer<typeof PatientFormValidation>) {
    setisLoading(true);

    let formData;

    //insure i have the file saved
    if (
      values.identificationDocumentId &&
      values.identificationDocumentId.length > 0
    ) {
      const blobFile = new Blob([values.identificationDocumentId[0]], {
        type: values.identificationDocumentId[0].type,
      }); //special version of file which browser can read
      formData = new FormData();
      formData.append("blobFile", blobFile);
      formData.append("fileName", values.identificationDocumentId[0].name);
    }

    try {
      const patient = {
        ...values,
        userId: user.$id,
        // name: values.name, to avoid doin this
        birthDate: new Date(values.birthDate), //to make it string
        identificationDocumentId: formData,
      };

      // @ts-ignore
      const newPatient = await registerPatient(patient);

      if (newPatient) router.push(`/patients/${user.$id}/new-appointment`); //the url with the patient's data
    } catch (error) {
      console.error("submit error", error);
    }
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-12 flex-1"
      >
        <section className="space-y-4">
          <h1 className="header">Welcome 👋</h1>
          <p className="text-dark-700">Let us know more about you.</p>
        </section>

        <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <p className="sub-header">Personal Information</p>
          </div>
        </section>

        {/* Full Name, Input */}
        <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="name"
          label="Full Name"
          placeholder="Asma rifi"
          iconSrc="/assets/icons/user.svg"
          iconAlt="user"
        />

        {/* Email, Input - Phone, Phone_Input */}
        <div className="flex flex-col gap-6 xl:flex-row ">
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="email"
            label="Email address"
            placeholder="xxx@mail.com"
            iconSrc="/assets/icons/email.svg"
            iconAlt="email address"
          />

          <CustomFormField
            fieldType={FormFieldType.PHONE_INPUT}
            control={form.control}
            name="phone"
            label="Phone number"
            placeholder="(505 555 5555)"
          />
        </div>

        {/* Date of birth, date_Picker - Gender, Skeleton */}
        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            fieldType={FormFieldType.DATE_PICKER}
            control={form.control}
            name="birth date"
            label="Date of Birth"
            iconSrc="/assets/icons/birth.svg"
            iconAlt="email address"
          />

          <CustomFormField
            fieldType={FormFieldType.SKELETON}
            control={form.control}
            name="gender"
            label="Gender"
            renderSkeleton={(field) => (
              <FormControl>
                <RadioGroup
                  className="flex h-11 gap-6 xl:justify-between"
                  onValueChange={field.onChange}
                  defaultValue="field.value"
                >
                  {GenderOptions.map((option) => (
                    <div key={option} className="radio-group">
                      <RadioGroupItem value={option} id={option} />
                      <Label htmlFor={option} className="cursor-pointer">
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </FormControl>
            )}
          />
        </div>

        {/* Address, Input - Occupation, Input */}
        <div className="flex flex-col gap-6 xl:flex-row ">
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="address"
            label="Address"
            placeholder="ex: Istanbul, Taksim"
          />

          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="occupation"
            label="Occupation"
            placeholder="Software Engineer"
          />
        </div>

        {/* Emergincy contact, Input, phone */}
        <div className="flex flex-col gap-6 xl:flex-row ">
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="emergencyContactName"
            label="Emergincy Contact Name"
            placeholder="Guardian's name"
          />

          <CustomFormField
            fieldType={FormFieldType.PHONE_INPUT}
            control={form.control}
            name="emergencyContactNumber"
            label="Emergincy Contact Number"
            placeholder="ex: +90 505 555 5555"
          />
        </div>

        {/* Medical info */}
        <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <p className="sub-header">Medical Information</p>
          </div>
        </section>

        {/* Select a doctor */}
        <CustomFormField
          fieldType={FormFieldType.SELECT}
          control={form.control}
          name="primaryPhysician"
          label="Primary Care Physician"
          placeholder="Select a physician"
        >
          {Doctors.map((doctor) => (
            <SelectItem key={doctor.name} value={doctor.name}>
              <div className="flex cursor-pointer item-center gap-2">
                <Image
                  src={doctor.image}
                  width={32}
                  height={32}
                  alt={doctor.name}
                  className="rounded-full border border-dark-500"
                />
                <p>{doctor.name}</p>
              </div>
            </SelectItem>
          ))}
        </CustomFormField>

        {/* isurance, Input, Input */}
        <div className="flex flex-col gap-6 xl:flex-row ">
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="insuranceProvider"
            label="Insurance Provider"
            placeholder="ex: SGK"
          />

          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="insurancePolicyNumber"
            label="Insurance Policy Number"
            placeholder="111-111"
          />
        </div>

        {/* allergies, texArea - current medication, textArea */}
        <div className="flex flex-col gap-6 xl:flex-row ">
          <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="allergies"
            label="Allergies (if any)"
            placeholder="Peanuts, Strawbwrry...etc."
          />

          <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="currentMedication"
            label="Current Medication (if any)"
            placeholder="Aspirin 200mg, baracetamol 500mg...etc."
          />
        </div>

        {/* family history, texArea - past history, textArea */}
        <div className="flex flex-col gap-6 xl:flex-row ">
          <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="familyMedicalHistory"
            label="Family Medical History (if any)"
            placeholder="Mother had diabese...etc."
          />

          <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="pastMedicalHistory"
            label="Past Medical Histoey (if any)"
            placeholder="Asthma...etc."
          />
        </div>

        {/* Identification info */}
        <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <p className="sub-header">Identification and Verfication</p>
          </div>
        </section>

        <CustomFormField
          fieldType={FormFieldType.SELECT}
          control={form.control}
          name="identificationType"
          label="Identification Type"
          placeholder="Select a Type"
        >
          {IdentificationTypes.map((type) => (
            <SelectItem key={type} value={type}>
              <div className="flex cursor-pointer">{type}</div>
            </SelectItem>
          ))}
        </CustomFormField>

        <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="identificationNumber"
          label="Identification Number"
          placeholder="ex: 123456"
        />

        <CustomFormField
          fieldType={FormFieldType.SKELETON}
          control={form.control}
          name="identificationDocumentId"
          label="Scanned Copy of Identification Document"
          renderSkeleton={(field) => (
            <FormControl>
              <FileUploader files={field.value} onChange={field.onChange} />
            </FormControl>
          )}
        />

        {/* Concent info */}
        <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <p className="sub-header">Consent and Privacy</p>
          </div>
        </section>

        <CustomFormField
          fieldType={FormFieldType.CHECKBOX}
          control={form.control}
          name="treatmentConsent"
          label="I concent to treatment"
        />
        <CustomFormField
          fieldType={FormFieldType.CHECKBOX}
          control={form.control}
          name="disclosureConsent"
          label="I concent to disclosure of information"
        />
        <CustomFormField
          fieldType={FormFieldType.CHECKBOX}
          control={form.control}
          name="privacyConsent"
          label="I accept the privacy policy"
        />

        <SubmitButton isLoading={isLoading}>Submit</SubmitButton>
      </form>
    </Form>
  );
};

export default RegisterForm;
