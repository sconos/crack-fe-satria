import Link from "next/link";
import Image from "next/image";

type Status = "Active" | "On leave" | "Remote" | "Pending";

const statusStyles: Record<Status, string> = {
    Active: "bg-primary/10 text-primary-dark ring-1 ring-inset ring-primary/20",
    "On leave":
        "bg-warning/10 text-warning-dark ring-1 ring-inset ring-warning/30",
    Remote: "bg-secondary/10 text-secondary ring-1 ring-inset ring-secondary/25",
    Pending: "bg-neutral/10 text-neutral ring-1 ring-inset ring-neutral/20",
};

const rosterRows: {
    name: string;
    role: string;
    initials: string;
    status: Status;
}[] = [
    {
        name: "Amara Yuwono",
        role: "Product Design",
        initials: "AY",
        status: "Active",
    },
    {
        name: "Bagas Wirawan",
        role: "Backend Eng.",
        initials: "BW",
        status: "Remote",
    },
    {
        name: "Citra Salsabila",
        role: "People Ops",
        initials: "CS",
        status: "On leave",
    },
    {
        name: "Dimas Prakoso",
        role: "Finance",
        initials: "DP",
        status: "Pending",
    },
    {
        name: "Elang Nararya",
        role: "Frontend Eng.",
        initials: "EN",
        status: "Active",
    },
];

const features = [
    {
        label: "Directory",
        title: "Find anyone in one search",
        body: "Look up a person, a role, or a whole team and see reporting lines, contact details, and tenure without digging through spreadsheets.",
    },
    {
        label: "Time & attendance",
        title: "Approve leave from your phone",
        body: "Requests land with the right manager automatically. Balances update the moment a request is approved, so nobody has to double-check a spreadsheet.",
    },
    {
        label: "Payroll",
        title: "Run payroll without the spreadsheet gymnastics",
        body: "Salary changes, prorated days, and reimbursements flow into the same run. Export a payslip batch in one pass.",
    },
    {
        label: "Performance",
        title: "Keep reviews on a real schedule",
        body: "Cycles, self-assessments, and manager sign-off happen on dates you set, with reminders that go out before someone forgets.",
    },
];

const steps = [
    {
        number: "01",
        title: "Invite the team",
        body: "Import a spreadsheet or add people one by one. Roles and reporting lines come with them.",
    },
    {
        number: "02",
        title: "Set the policies once",
        body: "Leave types, approval chains, and pay cycles are configured a single time, then apply to everyone they cover.",
    },
    {
        number: "03",
        title: "Manage day to day",
        body: "Approvals, changes, and reviews happen inside Kuro from the first day your team logs in.",
    },
];

export default function Home() {
    return (
        <div className="flex min-h-full flex-col">
            {/* Nav */}
            <header className="sticky top-0 z-20 border-b border-neutral/10 bg-primary-tint/80 backdrop-blur-sm">
                <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
                    <div className="flex items-center gap-2">
                        <Image
                            src="/logo-2.png"
                            alt="Kuro HRM"
                            width={500}
                            height={500}
                            priority
                            className="h-10 w-auto"
                        />
                    </div>
                    <nav className="hidden items-center gap-8 text-sm font-medium text-neutral md:flex">
                        <a
                            href="#features"
                            className="transition-colors hover:text-primary-dark"
                        >
                            Product
                        </a>
                        <a
                            href="#workflow"
                            className="transition-colors hover:text-primary-dark"
                        >
                            How it works
                        </a>
                        <a
                            href="#faq"
                            className="transition-colors hover:text-primary-dark"
                        >
                            FAQ
                        </a>
                    </nav>
                    <div className="flex items-center gap-3">
                        <Link
                            href="/login"
                            className="hidden text-sm font-medium text-neutral transition-colors hover:text-primary-dark sm:block"
                        >
                            Sign in
                        </Link>
                        <Link
                            href="#"
                            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-base-white shadow-sm transition-colors hover:bg-primary-dark"
                        >
                            Start free trial
                        </Link>
                    </div>
                </div>
            </header>

            <main className="flex-1">
                {/* Hero */}
                <section className="relative overflow-hidden">
                    <div
                        aria-hidden
                        className="pointer-events-none absolute inset-x-0 -top-40 -z-10 h-[520px]"
                        style={{
                            background:
                                "radial-gradient(600px circle at 15% 20%, rgba(21,128,61,0.10), transparent 60%), radial-gradient(500px circle at 85% 0%, rgba(8,145,178,0.10), transparent 60%)",
                        }}
                    />
                    <div className="mx-auto grid max-w-6xl gap-16 px-6 py-20 lg:grid-cols-2 lg:items-center lg:py-28">
                        <div>
                            <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary-dark ring-1 ring-inset ring-primary/20">
                                Now supporting multi-entity payroll
                            </span>
                            <h1 className="mt-6 font-heading text-4xl font-bold leading-[1.1] tracking-tight text-primary-dark sm:text-5xl">
                                Every person, every policy,
                                <br className="hidden sm:block" /> one source of
                                truth.
                            </h1>
                            <p className="mt-6 max-w-md text-base leading-7 text-neutral">
                                Kuro replaces the directory spreadsheet, the
                                leave request thread, and the payroll export
                                ritual with one system your whole company
                                actually opens.
                            </p>
                            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                                <Link
                                    href="#"
                                    className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-medium text-base-white shadow-sm transition-colors hover:bg-primary-dark"
                                >
                                    Start free trial
                                </Link>
                                <Link
                                    href="#workflow"
                                    className="inline-flex items-center justify-center rounded-lg border border-neutral/20 bg-base-white px-6 py-3 text-sm font-medium text-primary-dark transition-colors hover:border-primary/30 hover:bg-primary/5"
                                >
                                    See how setup works
                                </Link>
                            </div>
                            <p className="mt-5 text-xs text-neutral">
                                No credit card required · 14-day trial · Cancel
                                anytime
                            </p>
                        </div>

                        {/* Signature element: live roster panel, status colors carry meaning */}
                        <div className="relative">
                            <div className="rounded-2xl border border-neutral/10 bg-base-white p-5 shadow-xl shadow-primary-dark/5">
                                <div className="flex items-center justify-between border-b border-neutral/10 pb-4">
                                    <div>
                                        <p className="font-heading text-sm font-semibold text-primary-dark">
                                            Team roster
                                        </p>
                                        <p className="text-xs text-neutral">
                                            Engineering · 24 people
                                        </p>
                                    </div>
                                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-tint text-xs font-medium text-primary-dark ring-1 ring-inset ring-primary/15">
                                        24
                                    </span>
                                </div>
                                <ul className="divide-y divide-neutral/10">
                                    {rosterRows.map((row) => (
                                        <li
                                            key={row.name}
                                            className="flex items-center justify-between py-3"
                                        >
                                            <div className="flex items-center gap-3">
                                                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-tint text-xs font-heading font-semibold text-primary-dark ring-1 ring-inset ring-primary/10">
                                                    {row.initials}
                                                </span>
                                                <div>
                                                    <p className="text-sm font-medium text-primary-dark">
                                                        {row.name}
                                                    </p>
                                                    <p className="text-xs text-neutral">
                                                        {row.role}
                                                    </p>
                                                </div>
                                            </div>
                                            <span
                                                className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[row.status]}`}
                                            >
                                                {row.status}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            {/* small floating stat card for depth, not decoration for its own sake */}
                            <div className="absolute -bottom-6 -left-6 hidden rounded-xl border border-neutral/10 bg-base-white px-4 py-3 shadow-lg shadow-primary-dark/5 sm:block">
                                <p className="text-xs text-neutral">
                                    Leave requests this week
                                </p>
                                <p className="font-heading text-lg font-bold text-primary-dark">
                                    12{" "}
                                    <span className="text-xs font-medium text-secondary">
                                        approved
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Stats band */}
                <section className="border-y border-neutral/10 bg-base-white">
                    <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-6 py-10 sm:grid-cols-4">
                        {[
                            ["10–500", "employees per company"],
                            ["4 modules", "directory to payroll"],
                            ["<1 min", "to approve a request"],
                            ["99.9%", "uptime target"],
                        ].map(([stat, label]) => (
                            <div key={label}>
                                <p className="font-heading text-2xl font-bold text-primary-dark">
                                    {stat}
                                </p>
                                <p className="mt-1 text-xs text-neutral">
                                    {label}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Features */}
                <section id="features" className="mx-auto max-w-6xl px-6 py-24">
                    <div className="max-w-xl">
                        <p className="text-xs font-medium uppercase tracking-wide text-secondary">
                            What's inside
                        </p>
                        <h2 className="mt-3 font-heading text-3xl font-bold tracking-tight text-primary-dark">
                            Four modules, one shared record
                        </h2>
                        <p className="mt-4 text-base leading-7 text-neutral">
                            Each module reads from the same employee record, so
                            a change in one place, a title change, a new
                            manager, a salary update, shows up everywhere else
                            without a re-entry.
                        </p>
                    </div>
                    <div className="mt-12 grid gap-6 sm:grid-cols-2">
                        {features.map((f) => (
                            <div
                                key={f.title}
                                className="rounded-2xl border border-neutral/10 bg-base-white p-6 transition-shadow hover:shadow-md hover:shadow-primary-dark/5"
                            >
                                <p className="text-xs font-medium uppercase tracking-wide text-primary">
                                    {f.label}
                                </p>
                                <h3 className="mt-2 font-heading text-lg font-semibold text-primary-dark">
                                    {f.title}
                                </h3>
                                <p className="mt-2 text-sm leading-6 text-neutral">
                                    {f.body}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Workflow - genuinely sequential, so numbers earn their place */}
                <section id="workflow" className="bg-primary-dark">
                    <div className="mx-auto max-w-6xl px-6 py-24">
                        <div className="max-w-xl">
                            <p className="text-xs font-medium uppercase tracking-wide text-base-white/50">
                                Getting started
                            </p>
                            <h2 className="mt-3 font-heading text-3xl font-bold tracking-tight text-base-white">
                                Set up once, run every week
                            </h2>
                        </div>
                        <div className="mt-12 grid gap-10 sm:grid-cols-3">
                            {steps.map((step) => (
                                <div key={step.number}>
                                    <p className="font-heading text-sm font-bold text-secondary">
                                        {step.number}
                                    </p>
                                    <h3 className="mt-3 font-heading text-lg font-semibold text-base-white">
                                        {step.title}
                                    </h3>
                                    <p className="mt-2 text-sm leading-6 text-base-white/70">
                                        {step.body}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA band */}
                <section className="mx-auto max-w-6xl px-6 py-24">
                    <div className="flex flex-col items-start justify-between gap-8 rounded-2xl border border-neutral/10 bg-base-white p-10 shadow-sm sm:flex-row sm:items-center">
                        <div>
                            <h2 className="font-heading text-2xl font-bold text-primary-dark">
                                Move your team off spreadsheets this week
                            </h2>
                            <p className="mt-2 text-sm text-neutral">
                                Set up your directory in an afternoon. No
                                implementation call required.
                            </p>
                        </div>
                        <Link
                            href="#"
                            className="inline-flex shrink-0 items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-medium text-base-white shadow-sm transition-colors hover:bg-primary-dark"
                        >
                            Start free trial
                        </Link>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="border-t border-neutral/10">
                <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 text-xs text-neutral sm:flex-row">
                    <div className="flex items-center gap-2">
                        <Image
                            src="/logo-2.png"
                            alt="Kuro HRM"
                            width={500}
                            height={500}
                            priority
                            className="h-10 w-auto"
                        />
                    </div>
                    <p>
                        &copy; {new Date().getFullYear()} Kuro HRM. All rights
                        reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
}
