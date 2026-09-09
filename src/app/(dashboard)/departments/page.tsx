// app/departments/page.tsx
import { redirect } from "next/navigation";

export default function DepartmentsRedirectPage() {
    redirect("/employees?tab=departments");
}