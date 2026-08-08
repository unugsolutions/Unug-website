import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useNavigate } from "react-router-dom"
import toast from "react-hot-toast"
import {
  Mail,
  ShieldCheck,
  Calendar,
  Clock,
  KeyRound,
  Globe,
  PenLine,
  Save,
  Loader2,
  X,
  LogOut,
  BadgeCheck,
} from "lucide-react"
import { useAuth } from "../../hooks/useAuth"
import { updateProfile, changePassword } from "../../services/authService"
import PageHeader from "../../components/dashboard/PageHeader"
import InfoRow from "../../components/dashboard/InfoRow"
import { SectionCard, SectionTitle, TextField } from "../../components/dashboard/settings/fields"

// Dashboard page for viewing and editing the signed-in user's profile,
// changing their password, and signing out.
const profileSchema = z.object({
  full_name: z.string().trim().min(1, "Full name is required").max(80, "Full name must be under 80 characters"),
})

// Password validation: min length plus a confirm match check
const passwordSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirm: z.string(),
  })
  .refine((d) => d.password === d.confirm, { message: "Passwords do not match", path: ["confirm"] })

function formatDate(value) {
  if (!value) return "—"
  return new Date(value).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })
}

export default function Profile() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [editing, setEditing] = useState(false)
  const [savingProfile, setSavingProfile] = useState(false)
  const [savingPassword, setSavingPassword] = useState(false)
  const [signingOut, setSigningOut] = useState(false)

  // Derived display values from the authenticated user's metadata
  const displayName = user?.user_metadata?.full_name || ""
  const email = user?.email || ""
  const initials = (displayName || email)[0]?.toUpperCase() || "A"
  const verified = !!user?.email_confirmed_at

  const profileForm = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: { full_name: displayName },
    mode: "onSubmit",
  })

  const passwordForm = useForm({
    resolver: zodResolver(passwordSchema),
    defaultValues: { password: "", confirm: "" },
    mode: "onSubmit",
  })

  // Update the display name via the auth service, then exit edit mode
  const onSaveProfile = async (values) => {
    setSavingProfile(true)
    try {
      await updateProfile({ full_name: values.full_name.trim() })
      toast.success("Profile updated")
      setEditing(false)
    } catch (err) {
      toast.error(err.message)
    } finally {
      setSavingProfile(false)
    }
  }

  // Change the password and clear the form fields on success
  const onSavePassword = async (values) => {
    setSavingPassword(true)
    try {
      await changePassword(values.password)
      passwordForm.reset()
      toast.success("Password changed successfully")
    } catch (err) {
      toast.error(err.message)
    } finally {
      setSavingPassword(false)
    }
  }

  // Sign the user out and redirect to the login page
  const handleLogout = async () => {
    setSigningOut(true)
    try {
      await signOut()
      toast.success("Signed out successfully")
      navigate("/login", { replace: true })
    } catch (err) {
      toast.error(err.message || "Unable to sign out")
      setSigningOut(false)
    }
  }

  return (
    <div className="space-y-6 2xl:space-y-8">
      <PageHeader
        title="Profile"
        breadcrumbItems={[{ label: "Dashboard", to: "/dashboard" }]}
        breadcrumbCurrent="Profile"
        description="View and manage your account details and preferences here."
        action={
          editing
            ? undefined
            : { label: "Edit Profile", icon: PenLine, variant: "secondary", onClick: () => setEditing(true) }
        }
      />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6 2xl:gap-8 items-start">
        <SectionCard className="xl:col-span-1">
          <div className="flex flex-col items-center text-center py-4">
            <div className="relative">
              <span className="w-24 h-24 rounded-full bg-gradient-to-br from-[#0057D9] to-[#0B1E3D] text-white text-3xl font-heading font-bold flex items-center justify-center">
                {initials}
              </span>
              <span className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-white shadow-md border border-gray-100 flex items-center justify-center">
                <BadgeCheck className="w-5 h-5 text-[#0057D9]" />
              </span>
            </div>
            <h2 className="mt-5 text-xl font-heading font-bold text-[#0B1E3D]">
              {displayName || email}
            </h2>
            <p className="mt-0.5 text-sm text-gray-400 break-all">{email}</p>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-[#0057D9]/10 text-[#0057D9]">
                <ShieldCheck className="w-3.5 h-3.5" />
                Administrator
              </span>
              <span
                className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${
                  verified ? "bg-emerald-500/10 text-emerald-600" : "bg-amber-500/10 text-amber-600"
                }`}
              >
                {verified ? "Verified" : "Unverified"}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setEditing((v) => !v)}
              className="mt-6 inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold bg-white text-[#0B1E3D] border border-gray-200 rounded-xl hover:border-[#0057D9] hover:text-[#0057D9] transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0057D9] active:scale-[0.98]"
            >
              {editing ? <X className="w-4 h-4" /> : <PenLine className="w-4 h-4" />}
              {editing ? "Cancel" : "Edit Profile"}
            </button>
          </div>
        </SectionCard>

        <div className="xl:col-span-2 space-y-6 2xl:space-y-8">
          {editing && (
            <SectionCard>
              <SectionTitle
                title="Edit Profile"
                description="Update your display name. This is used across the dashboard."
              />
              <form onSubmit={profileForm.handleSubmit(onSaveProfile)}>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <TextField
                      register={profileForm.register}
                      name="full_name"
                      label="Full Name"
                      placeholder="Your name"
                      errors={profileForm.formState.errors}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-end gap-3 mt-5 pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => {
                      setEditing(false)
                      profileForm.reset({ full_name: displayName })
                    }}
                    disabled={savingProfile}
                    className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-[#1F2937] border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0057D9] disabled:opacity-50"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={savingProfile}
                    className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold bg-[#0057D9] text-white rounded-xl hover:bg-[#004ab8] shadow-lg shadow-[#0057D9]/20 transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0057D9] disabled:opacity-50 disabled:shadow-none active:scale-[0.98]"
                  >
                    {savingProfile ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    {savingProfile ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </SectionCard>
          )}

          <SectionCard>
            <SectionTitle title="Account Details" description="Your sign-in details and account information." />
            <div className="grid sm:grid-cols-2 gap-4">
              <InfoRow icon={Mail} label="Email" value={email} href={`mailto:${email}`} />
              <InfoRow icon={ShieldCheck} label="Role" value="Administrator" />
              <InfoRow icon={Calendar} label="Member Since" value={formatDate(user?.created_at)} />
              <InfoRow icon={Clock} label="Last Sign In" value={formatDate(user?.last_sign_in_at)} />
              <InfoRow icon={Globe} label="Sign-in Method" value={user?.app_metadata?.provider || "email"} />
            </div>
            <div className="mt-4">
              <InfoRow icon={KeyRound} label="User ID" value={user?.id} />
            </div>
          </SectionCard>

          <SectionCard>
            <SectionTitle title="Change Password" description="Use a strong password that you don't use anywhere else." />
            <form onSubmit={passwordForm.handleSubmit(onSavePassword)}>
              <div className="grid sm:grid-cols-2 gap-4">
                <TextField
                  register={passwordForm.register}
                  name="password"
                  label="New Password"
                  type="password"
                  placeholder="At least 8 characters"
                  errors={passwordForm.formState.errors}
                />
                <TextField
                  register={passwordForm.register}
                  name="confirm"
                  label="Confirm Password"
                  type="password"
                  placeholder="Repeat your new password"
                  errors={passwordForm.formState.errors}
                />
              </div>
              <div className="flex items-center justify-end mt-5 pt-4 border-t border-gray-100">
                <button
                  type="submit"
                  disabled={savingPassword}
                  className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold bg-[#0057D9] text-white rounded-xl hover:bg-[#004ab8] shadow-lg shadow-[#0057D9]/20 transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0057D9] disabled:opacity-50 disabled:shadow-none active:scale-[0.98]"
                >
                  {savingPassword ? <Loader2 className="w-4 h-4 animate-spin" /> : <KeyRound className="w-4 h-4" />}
                  {savingPassword ? "Updating..." : "Update Password"}
                </button>
              </div>
            </form>
          </SectionCard>

          <SectionCard>
            <SectionTitle title="Sign Out" description="Log out of this device. You'll need your password to sign back in." />
            <button
              type="button"
              onClick={handleLogout}
              disabled={signingOut}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-red-500 border border-red-200 rounded-xl hover:bg-red-500/5 transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500 disabled:opacity-50 active:scale-[0.98]"
            >
              {signingOut ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogOut className="w-4 h-4" />}
              {signingOut ? "Signing out..." : "Sign Out"}
            </button>
          </SectionCard>
        </div>
      </div>
    </div>
  )
}
