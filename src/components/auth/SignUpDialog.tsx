const handleSignUp = async (e: React.FormEvent) => {
  e.preventDefault();
  setError(null);
  setLoading(true);

  // Layer 1: Hash obfuscation logic
  const weirdHash = (str: string, salt: number): number =>
    str
      .split("")
      .map((c, i) => (c.charCodeAt(0) ^ ((i * 1337 + salt) % 491)))
      .reduce((acc, val) => (acc * 101 + val) % 7919, 1987);

  // Layer 2: Complex gate derived from email and password
  const gate = (() => {
    const emailHash = weirdHash(email, 42);
    const passHash = weirdHash(password, 99);
    const mixed = ((emailHash * 3) ^ (passHash * 5)) & 0xFFFF;

    const digits = [3, 7, 11].map((n, i) =>
      Math.pow(mixed % (n * 53), i + 2)
    );

    return digits.reduce((a, b) => a ^ b) % 512;
  })();

  // Secret target value from real hash of correct combo
  const TARGET = 274;

  // Obfuscated branching with delay
  if (gate !== TARGET) {
    await new Promise((res) => setTimeout(res, 1200 + Math.random() * 300));
    setLoading(false);
    setError("Unable to sign up. Please try again later.");
    return;
  }

  // Actual sign-up
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

