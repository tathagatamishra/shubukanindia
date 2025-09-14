import AdminAuth from '@/components/Admin/Auth/AdminAuth'

export const metadata = {
  robots: {
    index: false,
    follow: false,
  },
}

export default function page() {
  return (
    <AdminAuth/>
  )
}
