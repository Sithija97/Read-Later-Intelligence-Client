import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useSignIn, SignIn as SignInWithGoogle } from "@clerk/clerk-react";
import googleIcon from "@/assets/google.svg";

const SignIn = () => {
  const { signIn } = useSignIn();

  const handleGoogleSignIn = async () => {
    if (!signIn) return;

    await signIn.authenticateWithRedirect({
      strategy: "oauth_google",
      redirectUrl: "/",
      redirectUrlComplete: "/",
    });
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <div className={cn("transition-opacity duration-300 opacity-100")}>
          {/* Heading */}
          <div className="mb-12 text-center">
            <h1 className="text-3xl font-semibold mb-2">Read what you save</h1>
            <p className="text-muted-foreground">
              A calm place to finish articles you didn't have time for earlier
            </p>
          </div>

          {/* Google Sign In Button */}
          <div className="space-y-6">
            {/* <Button
              type="button"
              onClick={handleGoogleSignIn}
              variant="outline"
              className="w-full py-6 text-base flex items-center justify-center gap-2"
              size="lg"
            >
              <img src={googleIcon} alt="Google" className="h-5 w-5" />
              <span>Continue with Google</span>
            </Button> */}
            <SignInWithGoogle />

            {/* Footer text */}
            <p className="text-sm text-muted-foreground text-center">
              We don't post. We don't spam.
              <br />
              Just reading.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default SignIn;
