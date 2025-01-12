import Link from "next/link";
import LogoIcon from "@/components/icons/LogoIcon";
import { headers } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Button from "@/components/Button";

export default function LandingPage() {
  const signUp = async (formData: FormData) => {
    "use server";

    const origin = headers().get("origin");
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const supabase = createClient();

    const { error, data } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${origin}/auth/callback`,
      },
    });

    if (error) {
      console.log(error);
      return redirect("/?message=Could not authenticate user");
    }

    return redirect("/?message=Check email to continue sign in process");
  };

  return (
    <div className="bg-purple-950">
      <div className="bg-[url('/images/stars.svg')]">
        <div className="bg-gradient-to-t from-purple-900 to-transparent bg-fixed bg-cover bg-no-repeat bg-center bg-cover">
          <div className="min-h-screen z-10 py-4 max-w-5xl mx-auto px-4 text-center flex flex-col items-center gap-6 justify-center max-w-4xl md:gap-12">
            <LogoIcon className="mx-auto text-purple-100 h-12 w-auto"></LogoIcon>
            <div>
              <h1 className="font-serif font-semibold inline text-4xl sm:text-5xl lg:text-6xl text-gradient">
                Your minimalist
                <br /> virtual book shelf
              </h1>
              <p className="text-center mt-5 sm:text-xl text-purple-100/60 tracking-tight font-light leading-relaxed">
                Track books you read without all the fuss of Goodreads.
              </p>
            </div>

            <form
              action={signUp}
              className="shadow relative flex flex-col gap-5 max-w-sm w-full p-5 sm:p-8 bg-purple-900/20 ring-1 ring-purple-200/10 rounded-xl"
            >
              <div className="absolute -top-px left-0 right-20 h-px bg-gradient-to-r from-purple-400/0 via-purple-400/80 to-purple-400/0"></div>
              <div className="absolute -bottom-px left-20 right-0 h-px bg-gradient-to-r from-purple-400/0 via-purple-400/80 to-purple-400/0"></div>
              <div className="grid gap-2">
                <label
                  htmlFor="email"
                  className="text-left font-medium text-purple-100/80"
                >
                  Email address
                </label>
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full rounded-md ring-1 ring-gray-400/30 px-3 py-2 bg-white/10 focus:outline-none focus:ring-2 focus:ring-purple-200 text-white"
                />
              </div>

              <div className="grid gap-2">
                <label
                  htmlFor="password"
                  className="text-left font-medium text-purple-100/80"
                >
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full rounded-md ring-1 ring-gray-400/30 px-3 py-2 bg-white/10 focus:outline-none focus:ring-2 focus:ring-purple-200 text-white"
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                formAction={signUp}
                pendingText="Signing Up..."
                size="lg"
              >
                Sign up
              </Button>

              <p className="text-sm text-white/50">
                Already have an account?{" "}
                <Link className="underline text-purple-100" href="/login">
                  Sign in
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
