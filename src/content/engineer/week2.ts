import type { Lesson, Resource } from "../types";
import { U } from "../unis";

// AI engineer track, Week 2: probability. Anchor lecture: Harvard Stat 110 (Joe Blitzstein).
// Maths in \( \) or \[ \]; h`...` keeps backslashes.
const h = String.raw;
const yt = (id: string) => `https://www.youtube.com/watch?v=${id}`;

const V: Record<string, Resource> = {
  cond: {title:"Conditional probability — Joe Blitzstein", src:"Harvard Stat 110 · Lecture 4", len:"50 min", url:yt("P7NE4WF8j-Q")},
  total: {title:"Conditioning continued, law of total probability — Joe Blitzstein", src:"Harvard Stat 110 · Lecture 5", len:"50 min", url:yt("JzDvVgNDxo8")},
  bayes: {title:"Bayes theorem, the geometry of changing beliefs", src:"3Blue1Brown", len:"15 min", url:yt("HZGCoVF3YvM")},
  paradox: {title:"The medical test paradox, and redesigning Bayes' rule", src:"3Blue1Brown", len:"21 min", url:yt("lG4VkPoG3ko")},
  expect: {title:"Expectation, indicator random variables, linearity — Joe Blitzstein", src:"Harvard Stat 110 · Lecture 9", len:"50 min", url:yt("LX2q356N2rU")},
  entropy: {title:"Entropy (for data science), clearly explained", src:"StatQuest", len:"17 min", url:yt("YtebGVx-Fxw")},
  clt: {title:"But what is the Central Limit Theorem?", src:"3Blue1Brown", len:"31 min", url:yt("zeJD6dqJ5lo")},
  mle: {title:"Maximum likelihood, clearly explained", src:"StatQuest", len:"6 min", url:yt("XepXtl9YKwc")},
  normal: {title:"The normal distribution, clearly explained", src:"StatQuest", len:"5 min", url:yt("rzFX5NWojp0")}
};

const R: Record<string, Resource> = {
  book: {title:"Introduction to Probability (Blitzstein & Hwang), free PDF and Stat 110 materials", url:"https://projects.iq.harvard.edu/stat110/home"},
  mml: {title:"Mathematics for Machine Learning, Chapter 6: Probability and distributions", url:"https://mml-book.github.io"},
  d2l: {title:"Dive into Deep Learning, 2.6 Probability and statistics", url:"https://d2l.ai/chapter_preliminaries/probability.html"},
  seeing: {title:"Seeing Theory: interactive probability (Brown University)", url:"https://seeing-theory.brown.edu"},
  numpyrng: {title:"NumPy: random generator", url:"https://numpy.org/doc/stable/reference/random/generator.html"}
};

export const week2: Lesson[] = [
{
  id:"2-1", title:"Probability, counting and conditioning", mins:25,
  objectives:[
    "State the three axioms of probability and derive simple rules from them",
    "Count outcomes with the multiplication rule and binomial coefficients",
    "Compute a conditional probability and test two events for independence",
    "Estimate any probability by simulation, and say how accurate the estimate is",
  ],
  prereqs:"<p>Week 1, and Python with NumPy. School fractions are enough for the maths.</p>",
  body:h`
<h3>1. Why an AI engineer needs probability</h3>
<p>A language model does not output a word. It outputs a <b>probability distribution</b> over its whole vocabulary, and then samples from it. A classifier says "92% likely to be spam". A training loss (cross-entropy, Week 4) is a statement about probabilities. Evals (Month 3) are estimates with error bars. Probability is the language all of this is written in.</p>

<h3>2. Sample spaces and events</h3>
<p>An experiment has a <b>sample space</b> \(S\): the set of all possible outcomes. An <b>event</b> \(A\) is a subset of \(S\). Roll a die: \(S = \{1,2,3,4,5,6\}\), and "even" is the event \(A = \{2,4,6\}\).</p>
<p>When all outcomes are equally likely (and only then), the <b>naive definition</b> works:</p>
\[P(A) = \frac{|A|}{|S|} = \frac{\text{outcomes in } A}{\text{all outcomes}}.\]
<p>So \(P(\text{even}) = 3/6 = 1/2\). Most real problems are not equally likely, which is why we need the general rules below.</p>

<h3>3. Counting</h3>
<p><b>Multiplication rule.</b> If step 1 has \(a\) choices and step 2 has \(b\) choices whatever step 1 was, there are \(ab\) ways to do both. A 4-digit PIN has \(10^4 = 10{,}000\) possibilities.</p>
<p><b>Choosing without order.</b> The number of ways to pick \(k\) items from \(n\), ignoring order, is the binomial coefficient</p>
\[\binom{n}{k} = \frac{n!}{k!\,(n-k)!}.\]
<p>For example, there are \(\binom{5}{2} = 10\) ways to choose 2 symptoms from a list of 5.</p>
<p><b>The birthday problem</b> (Stat 110, Lecture 3) shows how badly intuition does here. With 23 people, the chance that two share a birthday is about 50%, because there are \(\binom{23}{2} = 253\) pairs, not 23. The same maths tells you how soon hash collisions appear, and why duplicate IDs show up in big datasets sooner than you expect.</p>

<h3>4. The axioms</h3>
<p>The general definition needs only two rules. A probability \(P\) assigns each event a number such that</p>
<ol>
<li>\(P(\varnothing) = 0\) and \(P(S) = 1\);</li>
<li>if \(A_1, A_2, \dots\) are <b>disjoint</b> (no overlap), then \(P(A_1 \cup A_2 \cup \dots) = P(A_1) + P(A_2) + \dots\).</li>
</ol>
<p>Everything else follows. Two consequences you will use constantly:</p>
\[P(A^c) = 1 - P(A), \qquad P(A \cup B) = P(A) + P(B) - P(A \cap B).\]
<p>The first is the "complement trick": it is often easier to compute the chance that something <i>never</i> happens and subtract from 1. That is exactly how the birthday problem is solved.</p>

<h3>5. Conditional probability</h3>
<p>Conditioning is how we update on evidence. The probability of \(A\) <b>given</b> that \(B\) happened is</p>
\[P(A \mid B) = \frac{P(A \cap B)}{P(B)}, \qquad P(B) > 0.\]
<p>Read it as: shrink the world to the outcomes where \(B\) is true, then ask what fraction of those also have \(A\). Roll a die and you are told the result is even. Now \(P(\text{six} \mid \text{even}) = (1/6)/(1/2) = 1/3\).</p>
<p>Rearranging gives the <b>multiplication rule</b> \(P(A \cap B) = P(B)\,P(A \mid B)\), which is how you compute the probability of a chain of events.</p>

<h3>6. Independence</h3>
<p>\(A\) and \(B\) are <b>independent</b> if knowing one tells you nothing about the other: \(P(A \mid B) = P(A)\), or equivalently \(P(A \cap B) = P(A)\,P(B)\).</p>
<p>Independence is an assumption you make about the world, and it is often wrong. Two readings from the same patient, two reviews from the same user, two eval cases copied from the same document: none are independent. Treating them as independent makes your confidence too high. Note too that <b>disjoint is not independent</b>: if \(A\) and \(B\) cannot both happen, learning \(B\) tells you \(A\) did not.</p>

<h3>7. Simulation: probability you can check</h3>
<p>The <b>frequentist</b> reading of \(P(A)\) is the long-run fraction of trials in which \(A\) happens. That gives you a universal check: simulate the experiment \(N\) times and count.</p>
<pre>rng = np.random.default_rng(0)
rolls = rng.integers(1, 7, size=100_000)
print((rolls % 2 == 0).mean())   # about 0.5</pre>
<p>How close is "about"? The estimate \(\hat p\) has a standard error of roughly \(\sqrt{p(1-p)/N}\). For \(p = 0.5\) and \(N = 100{,}000\) that is about 0.0016. To halve the error you need four times as many trials. Remember this rule; it decides how big your eval sets must be.</p>

<h3>Summary</h3>
<ul>
<li>Events are sets; probabilities follow from two axioms.</li>
<li>Count carefully: pairs grow like \(n^2\), which is why birthday-style collisions come early.</li>
<li>\(P(A \mid B) = P(A \cap B)/P(B)\): restrict the world to \(B\).</li>
<li>Independence is an assumption to justify, not a default.</li>
<li>Simulation error shrinks like \(1/\sqrt{N}\).</li>
</ul>`,
  watch:[U.stat110, V.cond],
  read:[R.book, R.seeing],
  exercise:h`<p>Simulate the birthday problem. For group sizes 2 to 60, run 20,000 trials each, estimate the probability of a shared birthday and plot it. On the same chart, plot the exact answer \(1 - \prod_{i=0}^{k-1} \frac{365 - i}{365}\). Mark where it crosses 50%. Then say in one sentence what this means for a system that gives each of 50,000 users a random 6-digit code.</p>`,
  problems:[
    {q:h`<p>A clinic gives each patient a random 3-digit ticket (000–999). On a day with 40 patients, what is the probability that at least two get the same ticket?</p>`,
     a:h`<p>Use the complement. All distinct: \(\frac{1000}{1000}\cdot\frac{999}{1000}\cdots\frac{961}{1000} = \prod_{i=0}^{39}(1 - i/1000)\). Taking logs, \(\sum \ln(1 - i/1000) \approx -\sum i/1000 = -780/1000 = -0.78\), so the product is about \(e^{-0.78} \approx 0.46\). The chance of a clash is about \(1 - 0.46 = 0.54\). Over half the days will have a duplicate ticket, with only 40 patients.</p>`},
    {q:h`<p>Draw two cards from a shuffled deck without replacement. What is the probability both are aces? Are "first card is an ace" and "second card is an ace" independent?</p>`,
     a:h`<p>\(P(A_1 \cap A_2) = P(A_1)\,P(A_2 \mid A_1) = \frac{4}{52}\cdot\frac{3}{51} = \frac{1}{221} \approx 0.0045\). Not independent: \(P(A_2) = 4/52\) by symmetry, but \(P(A_2 \mid A_1) = 3/51\), which is smaller.</p>`},
    {q:h`<p>You estimate a model's accuracy on 200 eval cases and get 0.80. Roughly how big is the standard error? How many cases would you need to get it down to 0.01?</p>`,
     a:h`<p>\(\sqrt{0.8 \times 0.2 / 200} = \sqrt{0.0008} \approx 0.028\), so the true accuracy could plausibly be anywhere from about 0.74 to 0.86 (two standard errors). For 0.01 you need \(0.16/N = 0.0001\), so \(N = 1{,}600\). Small eval sets cannot separate models that differ by a few points.</p>`}
  ],
  quiz:[
    {q:"Two events cannot both happen (they are disjoint) and each has positive probability. Are they independent?", o:["Yes, always","No: learning one happened tells you the other did not","Only if their probabilities are equal","It depends on the sample space"], a:1, why:"Independence needs P(A and B) = P(A)P(B) > 0, but disjoint events have P(A and B) = 0."},
    {q:"P(A | B) means:", o:["The chance of A and B together","The chance of A in the world restricted to outcomes where B happened","The chance of B given A","P(A) times P(B)"], a:1, why:"Conditioning shrinks the sample space to B: P(A | B) = P(A and B) / P(B)."},
    {q:"You run 10,000 simulations and want to halve the error of your estimate. How many runs do you need?", o:["20,000","40,000","100,000","15,000"], a:1, why:"Standard error scales as 1 / sqrt(N), so halving it needs 4 times the runs."}
  ]
},
{
  id:"2-2", title:"Bayes' rule and the diagnostic test", mins:25,
  objectives:[
    "Derive Bayes' rule from the definition of conditional probability",
    "Use the law of total probability to split a problem into cases",
    "Compute the chance a patient is ill after a positive test, from sensitivity, specificity and prevalence",
    "Explain base-rate neglect and why it matters for every classifier you deploy",
  ],
  prereqs:"<p>Lesson 2.1.</p>",
  body:h`
<h3>1. The question</h3>
<p>A malaria rapid test is 95% sensitive and 90% specific. In a Lagos clinic during the rainy season, 20% of feverish patients have malaria. In a low-transmission area it might be 2%. A patient tests positive. How likely is it that they have malaria? Most people, including many doctors in published surveys, answer "95%". The right answer depends heavily on the clinic, and in the second case it is far lower. This lesson shows why.</p>

<h3>2. The vocabulary of tests</h3>
<p>Let \(D\) = "has the disease" and \(+\) = "tests positive".</p>
<ul>
<li><b>Prevalence</b> (the prior): \(P(D)\).</li>
<li><b>Sensitivity</b> (true positive rate, recall): \(P(+ \mid D)\). How often the test catches a sick person.</li>
<li><b>Specificity</b> (true negative rate): \(P(- \mid D^c)\). How often it clears a healthy person. The <b>false positive rate</b> is \(1 - \text{specificity} = P(+ \mid D^c)\).</li>
<li><b>Positive predictive value</b> (precision): \(P(D \mid +)\). What the patient actually wants to know.</li>
</ul>
<p>Sensitivity and PPV condition in opposite directions. Confusing \(P(+ \mid D)\) with \(P(D \mid +)\) is the single most common probability mistake, and it has a name: the <b>prosecutor's fallacy</b>.</p>

<h3>3. Bayes' rule</h3>
<p>Write the multiplication rule both ways: \(P(D \cap +) = P(D)\,P(+ \mid D) = P(+)\,P(D \mid +)\). Divide by \(P(+)\):</p>
\[P(D \mid +) = \frac{P(+ \mid D)\,P(D)}{P(+)}.\]
<p>That is all Bayes' rule is: one line of algebra. The work is in the denominator.</p>

<h3>4. The law of total probability</h3>
<p>A positive test can happen in two disjoint ways: sick and positive, or healthy and positive. So</p>
\[P(+) = P(+ \mid D)\,P(D) + P(+ \mid D^c)\,P(D^c).\]
<p>In general, if \(B_1, \dots, B_k\) split the sample space into disjoint cases, \(P(A) = \sum_i P(A \mid B_i)\,P(B_i)\). "Split into cases, then add up" is one of the most useful moves in probability (Stat 110, Lecture 5).</p>

<h3>5. The worked answer</h3>
<p>High-prevalence clinic, \(P(D) = 0.20\):</p>
\[P(D \mid +) = \frac{0.95 \times 0.20}{0.95 \times 0.20 + 0.10 \times 0.80} = \frac{0.19}{0.19 + 0.08} \approx 0.70.\]
<p>Low-prevalence area, \(P(D) = 0.02\):</p>
\[P(D \mid +) = \frac{0.95 \times 0.02}{0.95 \times 0.02 + 0.10 \times 0.98} = \frac{0.019}{0.019 + 0.098} \approx 0.16.\]
<p>The same test, the same positive result, and the chance of malaria goes from 70% to 16%. In the low-prevalence area, five out of six positives are false alarms, because there are so many more healthy people for the 10% false-positive rate to act on.</p>

<h3>6. Natural frequencies</h3>
<p>The easiest way to get this right is to think in people, not percentages (3Blue1Brown's "medical test paradox"). Take 1,000 patients at 2% prevalence: 20 are sick and 980 are healthy. The test catches 19 of the 20. It also wrongly flags 98 of the 980. So 117 test positive and only 19 of them are sick: \(19/117 \approx 0.16\).</p>

<h3>7. The odds form</h3>
<p>Odds are \(P/(1-P)\). Bayes' rule becomes a multiplication:</p>
\[\underbrace{\frac{P(D \mid +)}{P(D^c \mid +)}}_{\text{posterior odds}} = \underbrace{\frac{P(D)}{P(D^c)}}_{\text{prior odds}} \times \underbrace{\frac{P(+ \mid D)}{P(+ \mid D^c)}}_{\text{likelihood ratio}}.\]
<p>The likelihood ratio here is \(0.95/0.10 = 9.5\): a positive result multiplies the odds by 9.5, whatever the prevalence. At 2% the prior odds are \(2:98\), and times 9.5 gives about \(19:98\), the same 16%. This form is how a doctor (or a triage model) chains several pieces of evidence: multiply by one likelihood ratio per finding, as long as the findings are independent given the disease.</p>

<h3>8. Why this is an AI lesson</h3>
<p>Every classifier is a diagnostic test. A fraud model that is "99% accurate" can still be wrong about most of the transactions it flags, if fraud is rare. When you move a model from one population to another (a different clinic, a different country), the prior changes, and so does the meaning of every positive. Always ask for the base rate.</p>

<h3>Summary</h3>
<ul>
<li>\(P(D \mid +) = P(+ \mid D)P(D)/P(+)\), with \(P(+)\) from the law of total probability.</li>
<li>Sensitivity is \(P(+ \mid D)\); PPV is \(P(D \mid +)\). Don't swap them.</li>
<li>Low prevalence means many false positives, even for a good test.</li>
<li>Odds form: posterior odds = prior odds × likelihood ratio.</li>
</ul>`,
  watch:[V.bayes, V.paradox, V.total],
  read:[R.book, R.mml],
  exercise:h`<p>Write a function <code>ppv(sens, spec, prev)</code>. Plot PPV against prevalence from 0.1% to 50% for three tests: (95%, 90%), (99%, 99%) and (80%, 98%). Mark the 2% and 20% points. Then write two sentences for a clinic manager: which test would you use for screening everyone, and which to confirm a positive?</p>`,
  problems:[
    {q:h`<p>A patient tests positive twice with the test above (95% sensitive, 90% specific), and the two results are independent given the disease status. Prevalence is 2%. What is \(P(D \mid ++)\)?</p>`,
     a:h`<p>Use the odds form. Prior odds \(2/98\). Each positive multiplies by \(9.5\): \(2/98 \times 9.5^2 = 2 \times 90.25 / 98 \approx 1.84\). Probability \(1.84/2.84 \approx 0.65\). Two positives take it from 2% to 65%. In practice, repeat tests on the same patient are often <i>not</i> independent (the same thing that fooled the first may fool the second), so the real figure is lower.</p>`},
    {q:h`<p>A spam filter flags 1% of legitimate email and catches 99% of spam. If 50% of email is spam, what fraction of flagged email is really spam? What if only 1% is spam?</p>`,
     a:h`<p>At 50%: \(0.99 \times 0.5 / (0.99 \times 0.5 + 0.01 \times 0.5) = 0.99\). At 1%: \(0.99 \times 0.01 / (0.99 \times 0.01 + 0.01 \times 0.99) = 0.5\). The same filter is right 99% of the time in one inbox and only half the time in another.</p>`},
    {q:h`<p>Show that if the test were useless, with \(P(+ \mid D) = P(+ \mid D^c)\), then \(P(D \mid +) = P(D)\).</p>`,
     a:h`<p>Let \(q = P(+ \mid D) = P(+ \mid D^c)\). Then \(P(+) = qP(D) + qP(D^c) = q\), so \(P(D \mid +) = qP(D)/q = P(D)\). The likelihood ratio is 1, so the evidence does not move the prior. "Uninformative" has a precise meaning.</p>`}
  ],
  quiz:[
    {q:"A test is 99% sensitive. A patient tests positive. What is the chance they are sick?", o:["99%","1%","It can't be known without the prevalence and the specificity","50%"], a:2, why:"Sensitivity is P(+ | D). The patient's chance is P(D | +), which needs the prior and the false positive rate."},
    {q:"The law of total probability says P(+) equals:", o:["P(+ | D) + P(+ | not D)","P(+ | D) P(D) + P(+ | not D) P(not D)","P(D | +) P(+)","P(D) times P(+ | D) only"], a:1, why:"Split into the disjoint cases 'sick' and 'healthy', weight each by its probability, and add."},
    {q:"In the odds form of Bayes' rule, a positive test with likelihood ratio 9.5 does what?", o:["Adds 9.5% to the probability","Multiplies the prior odds by 9.5","Sets the probability to 95%","Divides the prior by 9.5"], a:1, why:"Posterior odds = prior odds × likelihood ratio, whatever the prior."}
  ]
},
{
  id:"2-3", title:"Random variables, expectation, variance and entropy", mins:25,
  objectives:[
    "Define a random variable and its distribution (PMF or PDF)",
    "Use linearity of expectation, including with indicator variables",
    "Compute variance and standard deviation, and know when variances add",
    "Define entropy and cross-entropy, ready for the Week 4 loss function",
  ],
  prereqs:"<p>Lessons 2.1–2.2.</p>",
  body:h`
<h3>1. Random variables</h3>
<p>A <b>random variable</b> \(X\) is a number determined by the outcome of an experiment. The number of patients who arrive in an hour, the length of a model's reply, the loss on a randomly chosen training example: all random variables.</p>
<p>A <b>discrete</b> random variable has a <b>probability mass function</b> (PMF) \(p(x) = P(X = x)\), with \(\sum_x p(x) = 1\). A <b>continuous</b> one has a <b>density</b> \(f(x)\), where probabilities are areas: \(P(a \le X \le b) = \int_a^b f(x)\,dx\). A density can be bigger than 1; only its total area must be 1.</p>
<p>Three distributions cover most of what you need now:</p>
<ul>
<li><b>Bernoulli(\(p\))</b>: 1 with probability \(p\), else 0. One coin flip, one eval case right or wrong.</li>
<li><b>Binomial(\(n, p\))</b>: the number of 1s in \(n\) independent Bernoulli trials. \(P(X = k) = \binom{n}{k} p^k (1-p)^{n-k}\).</li>
<li><b>Categorical</b>: one of \(K\) outcomes with probabilities \(p_1, \dots, p_K\). This is exactly what a language model outputs at each step, with \(K\) the vocabulary size.</li>
</ul>

<h3>2. Expectation</h3>
<p>The <b>expected value</b> is the probability-weighted average:</p>
\[E[X] = \sum_x x\,p(x) \quad \text{or} \quad \int x\,f(x)\,dx.\]
<p>It is the long-run average of many draws. A fair die has \(E[X] = (1+2+\dots+6)/6 = 3.5\), a value it never actually shows.</p>
<p><b>Linearity of expectation</b> is the most useful fact in this lesson:</p>
\[E[aX + bY] = a\,E[X] + b\,E[Y],\]
<p>and it holds <b>even when \(X\) and \(Y\) are dependent</b>. Combine it with <b>indicator variables</b> (\(I_A = 1\) if event \(A\) happens, else 0, so \(E[I_A] = P(A)\)) and hard counting problems become easy. Expected number of correct answers on an eval of \(n\) cases, each correct with probability \(p_i\): \(E[\sum I_i] = \sum p_i\). No independence needed (Stat 110, Lecture 9).</p>

<h3>3. Variance</h3>
<p>Expectation gives the centre; <b>variance</b> gives the spread:</p>
\[\operatorname{Var}(X) = E\big[(X - E[X])^2\big] = E[X^2] - (E[X])^2.\]
<p>The <b>standard deviation</b> \(\sigma = \sqrt{\operatorname{Var}(X)}\) is in the same units as \(X\). Two rules:</p>
\[\operatorname{Var}(aX + b) = a^2 \operatorname{Var}(X), \qquad \operatorname{Var}(X + Y) = \operatorname{Var}(X) + \operatorname{Var}(Y) \ \text{ if independent.}\]
<p>For a Bernoulli(\(p\)): \(E[X] = p\), \(E[X^2] = p\), so \(\operatorname{Var}(X) = p - p^2 = p(1-p)\). For the average \(\bar X\) of \(n\) independent copies, \(\operatorname{Var}(\bar X) = p(1-p)/n\). Its square root is the standard error from lesson 2.1: now you know where it came from.</p>

<h3>4. Entropy: the expected surprise</h3>
<p>How surprised should you be by an outcome of probability \(p\)? A good measure is \(-\log p\): a certain event (\(p=1\)) gives 0 surprise, a rare one gives a lot, and surprises of independent events add, because logs turn products into sums. The <b>entropy</b> of a distribution is the expected surprise:</p>
\[H(p) = -\sum_x p(x) \log p(x).\]
<p>A fair coin has \(H = 1\) bit (using \(\log_2\)). A coin that lands heads 99% of the time has \(H \approx 0.08\) bits: there is little uncertainty. Entropy is largest when all outcomes are equally likely.</p>

<h3>5. Cross-entropy: being surprised by the wrong model</h3>
<p>Suppose the true distribution is \(p\) but you believe \(q\). Your average surprise is the <b>cross-entropy</b></p>
\[H(p, q) = -\sum_x p(x) \log q(x).\]
<p>It is always at least \(H(p)\), and equals it only when \(q = p\). The gap \(H(p,q) - H(p)\) is the <b>KL divergence</b> \(D_{\mathrm{KL}}(p \,\|\, q) \ge 0\). This is why cross-entropy is the loss for every classifier and every language model: when the true label is a single class \(y\), \(p\) puts all its mass on \(y\) and the cross-entropy is just \(-\log q(y)\), "minus the log of the probability you gave the right answer". Minimising it pushes \(q\) towards the truth. You will derive its gradient in Week 4.</p>
<p>Language-model <b>perplexity</b> is \(e^{H}\) of the average cross-entropy per token: a perplexity of 20 means the model is, on average, as unsure as if it were choosing uniformly between 20 tokens.</p>

<h3>Summary</h3>
<ul>
<li>A random variable is a number with a distribution (PMF or density).</li>
<li>\(E\) is linear, always. Indicators turn counts into sums of probabilities.</li>
<li>\(\operatorname{Var}(\bar X) = \sigma^2/n\) for independent draws: the source of every error bar.</li>
<li>Entropy is expected surprise; cross-entropy is surprise under the wrong model, and it is the training loss.</li>
</ul>`,
  watch:[V.expect, V.entropy],
  read:[R.book, R.d2l],
  exercise:h`<p>Take a categorical distribution over 5 "next tokens", \(p = (0.5, 0.2, 0.15, 0.1, 0.05)\). Compute its entropy. Then compute the cross-entropy \(H(p,q)\) for three model guesses: uniform; \(q = p\); and a confident wrong model \(q = (0.05, 0.05, 0.05, 0.05, 0.8)\). Finally, sample 10,000 tokens from \(p\) and check that the average of \(-\log q(x)\) over the samples matches your formula for each \(q\).</p>`,
  problems:[
    {q:h`<p>A hash table has \(m\) buckets and you insert \(n\) keys, each into a uniformly random bucket. What is the expected number of empty buckets?</p>`,
     a:h`<p>Let \(I_j = 1\) if bucket \(j\) is empty. \(P(I_j = 1) = (1 - 1/m)^n\). By linearity, the expected number of empty buckets is \(m(1 - 1/m)^n \approx m e^{-n/m}\). The \(I_j\) are dependent, but linearity doesn't care. With \(n = m\), about 37% of buckets stay empty.</p>`},
    {q:h`<p>Show \(\operatorname{Var}(X) = E[X^2] - (E[X])^2\).</p>`,
     a:h`<p>Let \(\mu = E[X]\). Expand: \(E[(X-\mu)^2] = E[X^2 - 2\mu X + \mu^2] = E[X^2] - 2\mu E[X] + \mu^2 = E[X^2] - 2\mu^2 + \mu^2 = E[X^2] - \mu^2\), using linearity and the fact that \(\mu\) is a constant.</p>`},
    {q:h`<p>A model gives the correct class probability 0.9 on half the examples and 0.01 on the other half. What is its average cross-entropy loss (natural log)? Which half dominates?</p>`,
     a:h`<p>\(\tfrac12(-\ln 0.9) + \tfrac12(-\ln 0.01) = \tfrac12(0.105) + \tfrac12(4.605) \approx 2.36\). The confident mistakes dominate: cross-entropy punishes being confidently wrong far more than it rewards being right. That is why overconfident models have high loss even when their accuracy looks fine.</p>`}
  ],
  quiz:[
    {q:"Linearity of expectation, E[X + Y] = E[X] + E[Y], requires X and Y to be:", o:["Independent","Identically distributed","Nothing: it always holds","Normally distributed"], a:2, why:"Linearity holds for any random variables. Variances add only for independent (or uncorrelated) ones."},
    {q:"Which distribution has the highest entropy over 4 outcomes?", o:["(1, 0, 0, 0)","(0.7, 0.1, 0.1, 0.1)","(0.25, 0.25, 0.25, 0.25)","(0.5, 0.5, 0, 0)"], a:2, why:"Entropy is largest when all outcomes are equally likely: here 2 bits."},
    {q:"With a single correct label y, the cross-entropy loss is:", o:["The squared error","Minus the log of the probability the model gave y","The model's accuracy","The entropy of the model's output"], a:1, why:"p puts all its mass on y, so the sum collapses to -log q(y)."}
  ]
},
{
  id:"2-4", title:"The normal distribution, the CLT and maximum likelihood", mins:30,
  objectives:[
    "Work with the normal distribution and z-scores",
    "State the law of large numbers and the central limit theorem, and show them by simulation",
    "Fit a model's parameters by maximum likelihood, and see why it means maximising a log",
    "Build the Week 2 project: simulate a diagnostic test and verify Bayes' rule",
  ],
  prereqs:"<p>Lessons 2.1–2.3.</p>",
  body:h`
<h3>1. The normal distribution</h3>
<p>The normal (Gaussian) distribution \(\mathcal N(\mu, \sigma^2)\) has density</p>
\[f(x) = \frac{1}{\sigma\sqrt{2\pi}} \exp\!\left(-\frac{(x - \mu)^2}{2\sigma^2}\right).\]
<p>It is the bell curve, centred at \(\mu\) with spread \(\sigma\). About 68% of the probability is within \(1\sigma\) of the mean, 95% within \(2\sigma\) (more exactly \(1.96\sigma\)) and 99.7% within \(3\sigma\). The <b>z-score</b> \(z = (x - \mu)/\sigma\) says how many standard deviations a value is from the mean, and turns any normal into the standard normal \(\mathcal N(0,1)\).</p>
<p>Neural network weights are usually initialised from a normal distribution, noise in diffusion models is normal, and measurement errors are often close to normal. The reason it turns up so often is the next section.</p>

<h3>2. The law of large numbers</h3>
<p>Let \(X_1, \dots, X_n\) be independent draws with mean \(\mu\). The sample mean \(\bar X_n = \frac1n \sum X_i\) converges to \(\mu\) as \(n\) grows. This is the <b>law of large numbers</b>, and it is why simulation works: the fraction of trials where \(A\) happens is the sample mean of an indicator, so it converges to \(P(A)\).</p>

<h3>3. The central limit theorem</h3>
<p>The LLN says \(\bar X_n\) gets close to \(\mu\). The <b>central limit theorem</b> says <i>how</i> it is spread around \(\mu\): if the \(X_i\) have variance \(\sigma^2\), then for large \(n\)</p>
\[\bar X_n \approx \mathcal N\!\left(\mu, \frac{\sigma^2}{n}\right),\]
<p>whatever the shape of the original distribution. Add up many small independent effects and you get a bell curve, which is why the normal is everywhere.</p>
<p>This gives you <b>confidence intervals</b>. An eval accuracy of \(\hat p\) on \(n\) cases is a sample mean of Bernoullis, so a 95% interval is approximately</p>
\[\hat p \pm 1.96\sqrt{\hat p(1 - \hat p)/n}.\]
<p>Model A scores 81% and model B 79% on 300 cases? Each interval is about \(\pm 4.5\) points wide, so you cannot yet say A is better. (Comparing two models properly uses a paired test on the same cases; Month 3 covers it.)</p>

<h3>4. Maximum likelihood</h3>
<p>So far the parameters were known. In machine learning we have data and must <b>estimate</b> the parameters. The most important method is <b>maximum likelihood</b>: choose the parameter \(\theta\) that makes the observed data most probable.</p>
<p>For independent data \(x_1, \dots, x_n\), the <b>likelihood</b> is \(L(\theta) = \prod_i p(x_i \mid \theta)\). Products of many small numbers underflow, and sums are easier to differentiate, so we maximise the <b>log-likelihood</b> instead (log is increasing, so the maximiser is the same):</p>
\[\ell(\theta) = \sum_{i=1}^n \log p(x_i \mid \theta).\]
<p><b>Worked example: a coin.</b> You see \(k\) heads in \(n\) flips. \(\ell(p) = k \log p + (n - k)\log(1 - p)\). Set the derivative to zero: \(k/p - (n-k)/(1-p) = 0\), so \(\hat p = k/n\). The obvious answer, now with a reason.</p>
<p><b>Worked example: a normal mean.</b> For \(\mathcal N(\mu, \sigma^2)\) with known \(\sigma\),</p>
\[\ell(\mu) = -\frac{1}{2\sigma^2}\sum_i (x_i - \mu)^2 + \text{const},\]
<p>so maximising the likelihood is the same as <b>minimising the sum of squared errors</b>, and \(\hat\mu = \bar x\). Keep this in mind: next week, least-squares regression turns out to be maximum likelihood with normal noise. In Week 4, the cross-entropy loss turns out to be maximum likelihood for a classifier. Almost every loss function you will meet is a negative log-likelihood.</p>

<h3>Summary</h3>
<ul>
<li>\(\mathcal N(\mu,\sigma^2)\): 68–95–99.7 within 1, 2, 3 standard deviations.</li>
<li>LLN: averages converge. CLT: averages are approximately normal, with spread \(\sigma/\sqrt n\).</li>
<li>95% interval for a proportion: \(\hat p \pm 1.96\sqrt{\hat p(1-\hat p)/n}\).</li>
<li>Maximum likelihood: maximise \(\sum \log p(x_i \mid \theta)\). Squared error and cross-entropy are both negative log-likelihoods.</li>
</ul>`,
  watch:[V.clt, V.mle, V.normal],
  read:[R.mml, R.numpyrng],
  exercise:h`<p><b>Week 2 build: simulate a diagnostic test and verify Bayes.</b> Write <code>simulate(n, prev, sens, spec, rng)</code> that creates \(n\) patients, makes each sick with probability <code>prev</code>, then gives each a test result using the sensitivity or specificity. Return the fraction of positives who are sick. For prevalences 1%, 5%, 20% and 50%, run it with \(n = 100{,}000\) and compare with the exact <code>ppv</code> from lesson 2.2; the gap should be within about two standard errors. Then repeat one setting 1,000 times with \(n = 2{,}000\), plot a histogram of the estimates and overlay the normal curve the CLT predicts. Publish the notebook with a one-paragraph explanation a nurse could follow.</p>`,
  problems:[
    {q:h`<p>Response times of an API are roughly normal with mean 400 ms and standard deviation 50 ms. What fraction of requests take longer than 500 ms? Is the normal a good model for the slowest requests?</p>`,
     a:h`<p>\(z = (500 - 400)/50 = 2\), and about 2.5% of a normal lies above \(+2\sigma\). But real latencies have a long right tail (retries, cold starts, garbage collection), so the normal badly underestimates the slow requests. That is why engineers report p95 and p99 measured from data, not from a fitted normal.</p>`},
    {q:h`<p>Model A gets 162 of 200 eval cases right. Give an approximate 95% confidence interval for its accuracy.</p>`,
     a:h`<p>\(\hat p = 0.81\). Standard error \(\sqrt{0.81 \times 0.19 / 200} \approx 0.0277\). Interval \(0.81 \pm 1.96 \times 0.0277 \approx 0.81 \pm 0.054\), so about 0.76 to 0.86.</p>`},
    {q:h`<p>The number of patients arriving per hour is Poisson: \(p(k \mid \lambda) = e^{-\lambda}\lambda^k/k!\). Find the maximum-likelihood \(\lambda\) from counts \(k_1, \dots, k_n\).</p>`,
     a:h`<p>\(\ell(\lambda) = \sum_i (-\lambda + k_i \log \lambda - \log k_i!) = -n\lambda + (\sum k_i)\log\lambda + \text{const}\). Derivative: \(-n + (\sum k_i)/\lambda = 0\), so \(\hat\lambda = \frac1n \sum k_i\), the average count. The second derivative \(-(\sum k_i)/\lambda^2 < 0\) confirms a maximum.</p>`}
  ],
  quiz:[
    {q:"The central limit theorem says the average of many independent draws is approximately:", o:["Uniform","Normal, with spread shrinking like 1 / sqrt(n)","Equal to the median","Normal only if the draws were normal"], a:1, why:"Whatever the original shape, the sample mean is approximately N(mu, sigma squared / n)."},
    {q:"Why maximise the log-likelihood instead of the likelihood?", o:["It gives a different, better answer","Same maximiser, but sums are easier to differentiate and don't underflow","Logs make the model linear","It is required by the CLT"], a:1, why:"Log is increasing, so the maximiser doesn't change. A product of thousands of probabilities underflows; a sum of logs doesn't."},
    {q:"Maximum likelihood for a normal mean with known variance is the same as:", o:["Minimising the sum of squared errors","Maximising the entropy","Minimising the absolute error","Choosing the median"], a:0, why:"The log-density is minus the squared error divided by 2 sigma squared, plus a constant."}
  ]
}
];
