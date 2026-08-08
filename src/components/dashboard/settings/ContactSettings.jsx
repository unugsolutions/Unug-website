import { SectionCard, SectionTitle, TextField } from "./fields"

export default function ContactSettings({ register, errors }) {
  return (
    <SectionCard>
      <SectionTitle
        title="Contact Information"
        description="How visitors reach you. Used in the footer, navbar, and contact page."
      />
      <div className="grid sm:grid-cols-2 gap-4">
        <TextField
          register={register}
          name="email"
          label="Email"
          type="email"
          placeholder="hello@example.com"
          errors={errors}
        />
        <TextField
          register={register}
          name="phone"
          label="Phone"
          placeholder="063327****"
          errors={errors}
        />
        <TextField
          register={register}
          name="whatsapp"
          label="WhatsApp Link"
          placeholder="https://wa.me/252638374348"
          hint="Full URL to your WhatsApp chat."
          errors={errors}
        />
        <TextField
          register={register}
          name="google_maps_url"
          label="Google Maps URL"
          placeholder="https://maps.google.com/?q=..."
          hint="Embedded on the contact page."
          errors={errors}
        />
      </div>
      <div className="grid sm:grid-cols-3 gap-4 mt-4">
        <div className="sm:col-span-3">
          <TextField
            register={register}
            name="address"
            label="Address"
            placeholder="Street address"
            errors={errors}
          />
        </div>
        <TextField register={register} name="city" label="City" placeholder="Hargeisa" errors={errors} />
        <TextField
          register={register}
          name="country"
          label="Country"
          placeholder="Somaliland"
          errors={errors}
        />
      </div>
    </SectionCard>
  )
}
