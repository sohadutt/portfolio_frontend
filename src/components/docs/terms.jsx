import { Link } from "react-router-dom";
import { ArrowLeft, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";

export default function Terms() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8 w-full">
      
      {/* --- HEADER: Back Button & Theme Toggle --- */}
      <div className="flex items-center justify-between mb-10 border-b pb-6">
        <Button variant="ghost" asChild className="-ml-4 text-muted-foreground hover:text-foreground">
          <Link to="/Login">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Link>
        </Button>

        <div className="flex items-center gap-2 rounded-full border bg-card p-1 shadow-sm">
          <Button
            type="button"
            variant={theme === "light" ? "default" : "ghost"}
            size="sm"
            className="rounded-full w-8 h-8 p-0"
            onClick={() => setTheme("light")}
          >
            <Sun className="size-4" />
          </Button>
          <Button
            type="button"
            variant={theme === "dark" ? "default" : "ghost"}
            size="sm"
            className="rounded-full w-8 h-8 p-0"
            onClick={() => setTheme("dark")}
          >
            <Moon className="size-4" />
          </Button>
        </div>
      </div>
      {/* ----------------------------------------- */}

      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        Terms of Service
      </h1>
      <p className="leading-7 [&:not(:first-child)]:mt-6 text-muted-foreground">
        Last updated: April 9, 2026
      </p>

      <p className="leading-7 [&:not(:first-child)]:mt-6">
        Please read these terms and conditions carefully before using our service. By accessing or using the website, you agree to be bound by these terms. If you disagree with any part of the terms, then you do not have permission to access the service.
      </p>

      <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0 mt-10">
        1. Intellectual Property
      </h2>
      <p className="leading-7 [&:not(:first-child)]:mt-6">
        The Service and its original content, features, and functionality are and will remain the exclusive property of the creator and its licensors. The Service is protected by copyright, trademark, and other laws of both the United States and foreign countries.
      </p>

      <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0 mt-10">
        2. User Accounts
      </h2>
      <p className="leading-7 [&:not(:first-child)]:mt-6">
        When you create an account with us, you must provide us information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.
      </p>
      <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
        <li>You are responsible for safeguarding the password that you use to access the Service.</li>
        <li>You agree not to disclose your password to any third party.</li>
        <li>You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.</li>
      </ul>

      <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0 mt-10">
        3. Links To Other Web Sites
      </h2>
      <p className="leading-7 [&:not(:first-child)]:mt-6">
        Our Service may contain links to third-party web sites or services that are not owned or controlled by us. We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any third party web sites or services.
      </p>

      <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0 mt-10">
        4. Termination
      </h2>
      <p className="leading-7 [&:not(:first-child)]:mt-6">
        We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms. Upon termination, your right to use the Service will immediately cease.
      </p>

      <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0 mt-10">
        5. Changes
      </h2>
      <p className="leading-7 [&:not(:first-child)]:mt-6">
        We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material we will try to provide at least 30 days notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
      </p>
    </div>
  );
}