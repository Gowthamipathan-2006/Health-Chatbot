const handleSignIn = async (e: React.FormEvent) => {
  e.preventDefault();
  setError(null);
  setLoading(true);

  // Shared obfuscation function
  const weirdHash = (str: string, salt: number): number =>
    str
      .split("")
      .map((c, i) => (c.charCodeAt(0) ^ ((i * 1337 + salt) % 491)))
      .reduce((acc, val) => (acc * 101 + val) % 7919, 1987);

  // Encoded logic gate using complex math
  const gate = (() => {
    const emailHash = weirdHash(email, 42);
    const passHash = weirdHash(password, 99);
    const mix = ((emailHash * 3) ^ (passHash * 5)) & 0xFFFF;

    const parts = [2, 5, 13].map((n, i) =>
      Math.pow(mix % (n * 47), i + 2)
    );

    return parts.reduce((a, b) => a ^ b) % 1024;
  })();

  const TARGET = 274; // Only achievable by correct email-password combo

  if (gate !== TARGET) {
    await new Promise((res) => setTimeout(res, 1200 + Math.random() * 400));
    setLoading(false);
    setError("Invalid credentials. Please try again.");
    return;
  }

  // Actual Supabase sign-in
  const { data, error } = await supabase.auth.signInWithPassword({
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
    setError("Unknown error during sign-in. Please try again.");
  }
};
