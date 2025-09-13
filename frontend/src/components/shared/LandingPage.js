import React from "react";
import { Link } from "react-router-dom";
import {
  Activity,
  CalendarDays,
  ShieldCheck,
  Users2,
  Stethoscope,
  FileText,
  Sparkles,
} from "lucide-react";

// Modern clinic-friendly palette using Tailwind theme colors
// - primary (teal) for brand
// - secondary (amber) for accents
// - neutral slate/gray for backgrounds and text

const LandingPage = () => {
  return (
    <div className="bg-gray-50 text-gray-800">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary-600 flex items-center justify-center text-white">
              <Stethoscope size={18} />
            </div>
            <span className="text-xl font-bold tracking-tight text-gray-900">
              CliniPrac
            </span>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm">
            <a href="#features" className="text-gray-600 hover:text-gray-900">
              Features
            </a>
            <a href="#security" className="text-gray-600 hover:text-gray-900">
              Security
            </a>
            <a
              href="#testimonials"
              className="text-gray-600 hover:text-gray-900"
            >
              Testimonials
            </a>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="px-4 py-2 text-sm font-semibold text-gray-700 hover:text-gray-900"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700"
            >
              <Sparkles size={16} /> Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <header className="relative pt-24">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-primary-50 via-white to-white" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 text-primary-700 text-xs font-medium ring-1 ring-primary-100">
                <Sparkles size={14} /> Modern Clinic Management
              </div>
              <h1 className="mt-4 text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900">
                Streamline your clinic with confidence
              </h1>
              <p className="mt-4 text-lg text-gray-600">
                Appointments, patient records, prescriptions, and
                staff—organized in one secure, intuitive platform built for
                modern clinics.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Link
                  to="/register"
                  className="inline-flex justify-center items-center gap-2 px-6 py-3 rounded-lg text-white bg-primary-600 hover:bg-primary-700 font-semibold"
                >
                  Start free today
                </Link>
                <Link
                  to="/login"
                  className="inline-flex justify-center items-center px-6 py-3 rounded-lg bg-white text-gray-900 ring-1 ring-gray-200 hover:bg-gray-50 font-semibold"
                >
                  Sign in
                </Link>
              </div>
              <div className="mt-8 grid grid-cols-3 gap-6 text-center">
                <div className="p-4 rounded-lg bg-white shadow-sm border border-gray-100">
                  <div className="text-2xl font-extrabold text-gray-900">
                    99.9%
                  </div>
                  <div className="text-xs text-gray-500">Uptime</div>
                </div>
                <div className="p-4 rounded-lg bg-white shadow-sm border border-gray-100">
                  <div className="text-2xl font-extrabold text-gray-900">
                    24h
                  </div>
                  <div className="text-xs text-gray-500">Setup</div>
                </div>
                <div className="p-4 rounded-lg bg-white shadow-sm border border-gray-100">
                  <div className="text-2xl font-extrabold text-gray-900">
                    HIPAA
                  </div>
                  <div className="text-xs text-gray-500">Aligned</div>
                </div>
              </div>
            </div>

            {/* Visual panel */}
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden bg-white shadow-xl ring-1 ring-gray-200">
                <div className="p-6 grid gap-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-primary-100 text-primary-700 flex items-center justify-center">
                        <CalendarDays size={18} />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-gray-900">
                          Today's Appointments
                        </div>
                        <div className="text-xs text-gray-500">
                          Real-time overview
                        </div>
                      </div>
                    </div>
                    <span className="text-2xl font-extrabold text-gray-900">
                      18
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="rounded-lg p-4 bg-gray-50">
                      <div className="text-xs text-gray-500">New Patients</div>
                      <div className="mt-1 text-lg font-bold text-gray-900">
                        6
                      </div>
                    </div>
                    <div className="rounded-lg p-4 bg-gray-50">
                      <div className="text-xs text-gray-500">Follow-ups</div>
                      <div className="mt-1 text-lg font-bold text-gray-900">
                        9
                      </div>
                    </div>
                    <div className="rounded-lg p-4 bg-gray-50">
                      <div className="text-xs text-gray-500">Prescriptions</div>
                      <div className="mt-1 text-lg font-bold text-gray-900">
                        12
                      </div>
                    </div>
                  </div>
                  <div className="rounded-xl p-4 bg-gradient-to-r from-primary-600 to-primary-500 text-white flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Activity size={18} />
                      <span className="text-sm font-semibold">
                        System Health
                      </span>
                    </div>
                    <span className="text-sm font-medium">
                      All systems operational
                    </span>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-6 -left-6 h-28 w-28 bg-primary-200 rounded-full blur-2xl opacity-50" />
              <div className="absolute -top-6 -right-6 h-28 w-28 bg-secondary-200 rounded-full blur-2xl opacity-50" />
            </div>
          </div>
        </div>
      </header>

      {/* Features */}
      <section id="features" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
              Everything your clinic needs
            </h2>
            <p className="mt-3 text-gray-600">
              Powerful tools that are simple to use—purpose-built for outpatient
              clinics.
            </p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <FeatureCard
              icon={<CalendarDays className="text-primary-600" size={28} />}
              title="Smart Scheduling"
              desc="Drag-and-drop calendar, reminders, and no-show tracking to keep days on track."
            />
            <FeatureCard
              icon={<Users2 className="text-primary-600" size={28} />}
              title="Patient Management"
              desc="Unified records, history, and demographics with fast search and filters."
            />
            <FeatureCard
              icon={<FileText className="text-primary-600" size={28} />}
              title="E-Prescriptions"
              desc="Create, review, and print prescriptions with your clinic's preferences."
            />
            <FeatureCard
              icon={<Stethoscope className="text-primary-600" size={28} />}
              title="Doctor-first UX"
              desc="Chart quickly with structured notes and shortcuts designed with clinicians."
            />
          </div>
        </div>
      </section>

      {/* Security */}
      <section
        id="security"
        className="py-20 bg-white border-y border-gray-100"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid gap-10 md:grid-cols-2 items-center">
          <div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
              Security you can trust
            </h3>
            <p className="mt-3 text-gray-600">
              Data encryption in transit, role-based access control, and audit
              logs. We follow best practices aligned with healthcare data
              protection standards.
            </p>
            <ul className="mt-6 space-y-3 text-gray-700">
              <li className="flex items-start gap-3">
                <ShieldCheck className="text-primary-600 mt-0.5" size={18} />{" "}
                Encrypted and token-secured APIs
              </li>
              <li className="flex items-start gap-3">
                <ShieldCheck className="text-primary-600 mt-0.5" size={18} />{" "}
                Granular role and permission controls
              </li>
              <li className="flex items-start gap-3">
                <ShieldCheck className="text-primary-600 mt-0.5" size={18} />{" "}
                Regular backups and export options
              </li>
            </ul>
          </div>
          <div className="rounded-2xl p-6 bg-gray-50 border border-gray-100">
            <div className="grid grid-cols-3 gap-4 text-center">
              <Stat value="256-bit" label="Encryption" />
              <Stat value="RBAC" label="Access Control" />
              <Stat value="24/7" label="Monitoring" />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <h3 className="text-3xl font-extrabold text-gray-900">
              Trusted by modern clinics
            </h3>
            <p className="mt-3 text-gray-600">
              Hear from teams who simplified their daily workflows.
            </p>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Testimonial
              text="Scheduling and records in one place—our front desk runs smoother than ever."
              author="Clinic Admin"
              role="Premium Healthcare"
            />
            <Testimonial
              text="Writing prescriptions is fast and consistent. Love the streamlined UI."
              author="Dr. R. Singh"
              role="General Physician"
            />
            <Testimonial
              text="We onboarded in a day and the team felt at home instantly."
              author="Reception Lead"
              role="Sunrise Clinic"
            />
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl p-8 sm:p-10 bg-gradient-to-r from-primary-600 to-primary-500 text-white flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h4 className="text-2xl font-extrabold">
                Ready to modernize your clinic?
              </h4>
              <p className="text-white/90 mt-1">
                Start free. No credit card required.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                to="/register"
                className="px-5 py-3 rounded-lg bg-white text-primary-700 font-semibold hover:bg-gray-50"
              >
                Create your account
              </Link>
              <Link
                to="/login"
                className="px-5 py-3 rounded-lg ring-1 ring-white/60 text-white hover:bg-white/10 font-semibold"
              >
                I already have one
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-sm text-gray-600 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-gray-700">
            <div className="h-6 w-6 rounded-md bg-primary-600 text-white flex items-center justify-center">
              <Stethoscope size={14} />
            </div>
            <span className="font-semibold">CliniPrac</span>
            <span className="text-gray-400">© {new Date().getFullYear()}</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#features" className="hover:text-gray-900">
              Features
            </a>
            <a href="#security" className="hover:text-gray-900">
              Security
            </a>
            <a href="#testimonials" className="hover:text-gray-900">
              Testimonials
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }) => (
  <div className="group rounded-2xl p-6 bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
    <div className="h-11 w-11 rounded-lg bg-primary-50 flex items-center justify-center mb-4 group-hover:bg-primary-100">
      {icon}
    </div>
    <div className="text-lg font-semibold text-gray-900">{title}</div>
    <p className="mt-1 text-gray-600 text-sm">{desc}</p>
  </div>
);

const Stat = ({ value, label }) => (
  <div className="p-4 rounded-lg bg-white shadow-sm border border-gray-100">
    <div className="text-xl font-extrabold text-gray-900">{value}</div>
    <div className="text-xs text-gray-500">{label}</div>
  </div>
);

const Testimonial = ({ text, author, role }) => (
  <div className="rounded-2xl p-6 bg-white border border-gray-100 shadow-sm">
    <p className="text-gray-700">“{text}”</p>
    <div className="mt-4 text-sm text-gray-600">
      <span className="font-semibold text-gray-900">{author}</span> • {role}
    </div>
  </div>
);

export default LandingPage;
