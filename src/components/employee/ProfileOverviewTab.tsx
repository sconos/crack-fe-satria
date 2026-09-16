import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import type { EmployeeProfile } from "@/types/employee-profile";

function Field({
    label,
    value,
}: {
    label: string;
    value: string | undefined | null;
}) {
    return (
        <div>
            <p className="text-xs text-neutral">{label}</p>
            <p className="mt-0.5 text-sm font-medium text-primary-dark">
                {value && value.trim() ? value : "—"}
            </p>
        </div>
    );
}

export function ProfileOverviewTab({
    employee,
}: {
    employee: EmployeeProfile;
}) {
    return (
        <div className="grid gap-6 lg:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle>Personal details</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                    <Field label="Phone" value={employee.phone} />
                    <Field
                        label="Work location"
                        value={employee.workLocation}
                    />
                    <div className="col-span-2">
                        <Field label="Address" value={employee.address} />
                    </div>
                    <Field
                        label="Emergency contact"
                        value={employee.emergencyContactName}
                    />
                    <Field
                        label="Emergency phone"
                        value={employee.emergencyContactPhone}
                    />
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Employment</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                    <Field label="Department" value={employee.department} />
                    <Field label="Role" value={employee.role} />
                    <Field
                        label="Employment type"
                        value={employee.employmentType}
                    />
                    <Field label="Reports to" value={employee.manager} />
                    <Field
                        label="Join date"
                        value={
                            employee.joinDate
                                ? new Date(employee.joinDate).toLocaleDateString(
                                      "en-US",
                                      {
                                          year: "numeric",
                                          month: "long",
                                          day: "numeric",
                                      },
                                  )
                                : undefined
                        }
                    />
                </CardContent>
            </Card>
        </div>
    );
}