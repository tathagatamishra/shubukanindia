import AdminAuth from '@/components/x/Auth/AdminAuth'

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
