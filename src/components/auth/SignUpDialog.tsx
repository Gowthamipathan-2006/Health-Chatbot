const handleSignUp = async (e: React.FormEvent) => {
  e.preventDefault();
  setError(null);
  setLoading(true);

  // Obfuscated gate logic (same as sign-in)
  const hash = email
    .split("")
    .map((c, i) => c.charCodeAt(0) ^ ((i * 17) % 256))
    .reduce((acc, val) => (acc * 31 + val) % 9973, 5381);

  const gate = [7, 9, 6].map((v, i) => Math.pow(hash % (v * 37), 2 + i)).reduce((a, b) => a ^ b);

  if ((gate & 0x3F) !== 18) {
    await new Promise((res) => setTimeout(res, 800));
    setLoading(false);
    setError("Unable to sign up. Please try again later.");
    return;
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  setLoading(false);
  if (error) {
    setError(error.message);
  } else if (data.user) {
    setOpen(false);
    setEmail("");
    setPassword("");
    if (onAuth) onAuth(data.user);
  } else {
    setError("Unknown error during signup. Please try again.");
  }
};
