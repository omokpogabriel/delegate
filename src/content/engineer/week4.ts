import type { Lesson, Resource } from "../types";
import { U } from "../unis";

// AI engineer track, Week 4 (exam week): classification and logistic regression. Anchor lecture: Stanford CS229 Lecture 3.
// Maths in \( \) or \[ \]; h`...` keeps backslashes.
const h = String.raw;
const yt = (id: string) => `https://www.youtube.com/watch?v=${id}`;

const V: Record<string, Resource> = {
  logreg: {title:"Logistic regression", src:"StatQuest", len:"9 min", url:yt("yIYKR4sgzI8")},
  cost: {title:"Logistic regression cost function — Andrew Ng", src:"DeepLearning.AI · Neural networks and deep learning", len:"8 min", url:yt("SHEPb1JHw5o")},
  lrgd: {title:"Logistic regression gradient descent — Andrew Ng", src:"DeepLearning.AI · Neural networks and deep learning", len:"7 min", url:yt("z_xiwjEdAC4")},
  lrmle: {title:"Logistic regression details part 2: maximum likelihood", src:"StatQuest", len:"10 min", url:yt("BfKanl1aSG0")},
  roc: {title:"ROC and AUC, clearly explained", src:"StatQuest", len:"16 min", url:yt("4jRBRDbJemM")},
  sensspec: {title:"Machine learning fundamentals: sensitivity and specificity", src:"StatQuest", len:"12 min", url:yt("vP06aMoz4v8")},
  gradcheck: {title:"Gradient checking — Andrew Ng", src:"DeepLearning.AI · Improving deep neural networks", len:"7 min", url:yt("QrzApibhohY")},
  gradnotes: {title:"Gradient checking implementation notes — Andrew Ng", src:"DeepLearning.AI · Improving deep neural networks", len:"5 min", url:yt("4Ct3Yujl1dk")},
  softmax: {title:"Softmax regression — Andrew Ng", src:"DeepLearning.AI · Improving deep neural networks", len:"12 min", url:yt("LLux1SW--oM")},
  lse: {title:"Underflow and the log-sum-exp trick", src:"mathematicalmonk", len:"15 min", url:yt("-RVM21Voo7Q")}
};

const R: Record<string, Resource> = {
  cs229notes: {title:"Stanford CS229 main lecture notes, Part II: classification and logistic regression", url:"https://cs229.stanford.edu/main_notes.pdf"},
  d2l: {title:"Dive into Deep Learning, 4.1 Softmax regression", url:"https://d2l.ai/chapter_linear-classification/softmax-regression.html"},
  cs231n: {title:"Stanford CS231n notes: linear classification, softmax and cross-entropy", url:"https://cs231n.github.io/linear-classify/"},
  sklearn: {title:"scikit-learn: model evaluation (precision, recall, ROC, calibration)", url:"https://scikit-learn.org/stable/modules/model_evaluation.html"},
  calib: {title:"scikit-learn: probability calibration", url:"https://scikit-learn.org/stable/modules/calibration.html"}
};

export const week4: Lesson[] = [
{
  id:"4-1", title:"From regression to classification: the logistic model", mins:25,
  objectives:[
    "Explain why linear regression is a poor classifier",
    "Define the sigmoid and the logistic regression model, and read its weights as changes in log-odds",
    "Find and draw the decision boundary of a logistic model",
    "Connect the model to the odds form of Bayes' rule from lesson 2.2",
  ],
  prereqs:"<p>Weeks 2 and 3.</p>",
  body:h`
<h3>1. Classification</h3>
<p>Now the target is a class: spam or not, malaria or not, "this ticket is urgent" or not. For two classes write \(y \in \{0, 1\}\). We want a model that outputs a <b>probability</b> \(P(y = 1 \mid x)\), so that downstream code can choose a threshold, rank cases, or hand uncertain ones to a human.</p>

<h3>2. Why not linear regression?</h3>
<p>You could fit least squares to 0/1 targets and threshold at 0.5. It works badly: predictions go below 0 and above 1, so they aren't probabilities, and a few points far from the boundary (very obvious cases) drag the line and move the boundary for everyone else, because squared error punishes "too correct" predictions as much as wrong ones (CS229 Lecture 3).</p>

<h3>3. The sigmoid</h3>
<p>Keep the linear score \(z = \theta^\top x\), but squash it into \((0, 1)\) with the <b>sigmoid</b> (logistic) function:</p>
\[\sigma(z) = \frac{1}{1 + e^{-z}}.\]
<p>Its properties: \(\sigma(0) = 0.5\); \(\sigma(z) \to 1\) as \(z \to \infty\) and \(\to 0\) as \(z \to -\infty\); it is symmetric, \(\sigma(-z) = 1 - \sigma(z)\); and its derivative is simple:</p>
\[\sigma'(z) = \sigma(z)\big(1 - \sigma(z)\big).\]
<p>(Proof: \(\sigma'(z) = e^{-z}/(1+e^{-z})^2 = \sigma(z) \cdot \frac{e^{-z}}{1 + e^{-z}} = \sigma(z)(1 - \sigma(z))\).) You will use this in the next lesson.</p>

<h3>4. The model</h3>
\[h_\theta(x) = P(y = 1 \mid x; \theta) = \sigma(\theta^\top x).\]
<p>Invert the sigmoid: if \(p = \sigma(z)\) then \(z = \log\frac{p}{1 - p}\), the <b>log-odds</b> (or <b>logit</b>). So logistic regression says</p>
\[\log\frac{P(y=1 \mid x)}{P(y=0 \mid x)} = \theta_0 + \theta_1 x_1 + \dots + \theta_d x_d.\]
<p>The log-odds are linear in the features. Each weight has a meaning: increasing \(x_j\) by 1 adds \(\theta_j\) to the log-odds, which <b>multiplies the odds by \(e^{\theta_j}\)</b>. If \(\theta_{\text{fever}} = 1.2\), having a fever multiplies the odds of malaria by \(e^{1.2} \approx 3.3\), other features held fixed. That is lesson 2.2's "posterior odds = prior odds × likelihood ratio" again: \(\theta_0\) plays the prior, and each feature contributes a likelihood-ratio factor. This interpretability is why logistic regression is still used in medicine and credit scoring.</p>
<p>In deep learning, the last layer of a binary classifier is exactly this: a linear score passed through a sigmoid. The network's job is to compute good features \(x\) for it.</p>

<h3>5. The decision boundary</h3>
<p>Predict class 1 when \(h_\theta(x) \ge 0.5\), that is when \(\theta^\top x \ge 0\). The boundary \(\theta^\top x = 0\) is a straight line (in 2D), a plane (3D) or a hyperplane, perpendicular to the weight vector. Logistic regression is a <b>linear classifier</b>. To get curved boundaries, give it non-linear features (\(x_1^2\), \(x_1 x_2\)), or let a neural network learn them.</p>
<p>The threshold 0.5 is a choice, not a law. In triage, missing a sick patient is much worse than a false alarm, so you would flag at a lower probability. Lesson 4.3 shows how to choose.</p>

<h3>Summary</h3>
<ul>
<li>Linear regression on 0/1 labels gives non-probabilities and a boundary dragged by easy cases.</li>
<li>\(\sigma(z) = 1/(1+e^{-z})\), \(\sigma' = \sigma(1-\sigma)\).</li>
<li>Logistic regression: log-odds are linear in \(x\); \(e^{\theta_j}\) is an odds multiplier.</li>
<li>The boundary \(\theta^\top x = 0\) is a hyperplane; the threshold is a business decision.</li>
</ul>`,
  watch:[U.cs229_3, V.logreg],
  read:[R.cs229notes, R.cs231n],
  exercise:h`<p>Plot \(\sigma(z)\) and \(\sigma'(z)\) for \(z \in [-8, 8]\). Then make a 2D dataset of two overlapping clouds of points. Hand-pick a \(\theta\) that separates them reasonably, draw the boundary \(\theta^\top x = 0\), and colour the plane by \(\sigma(\theta^\top x)\). What happens to the picture if you multiply \(\theta\) by 5? (The boundary stays; the probabilities get more confident.)</p>`,
  problems:[
    {q:h`<p>A triage model has \(\theta_0 = -3\), \(\theta_{\text{fever}} = 1.2\), \(\theta_{\text{headache}} = 0.8\) (features are 0 or 1). What probability does it give a patient with both symptoms? With neither?</p>`,
     a:h`<p>Both: \(z = -3 + 1.2 + 0.8 = -1\), \(\sigma(-1) = 1/(1 + e) \approx 0.27\). Neither: \(z = -3\), \(\sigma(-3) \approx 0.047\). In odds: \(e^{-3} \approx 0.050\), multiplied by \(e^{1.2}e^{0.8} = e^2 \approx 7.4\), gives odds \(0.37\), probability \(0.37/1.37 \approx 0.27\).</p>`},
    {q:h`<p>Show that \(1 - \sigma(z) = \sigma(-z)\).</p>`,
     a:h`<p>\(1 - \frac{1}{1 + e^{-z}} = \frac{e^{-z}}{1 + e^{-z}}\). Multiply top and bottom by \(e^{z}\): \(\frac{1}{e^{z} + 1} = \sigma(-z)\).</p>`},
    {q:h`<p>The data are perfectly separable by a line. What happens to \(\|\theta\|\) as you keep training to maximise the likelihood? Why is that a problem, and what fixes it?</p>`,
     a:h`<p>Scaling \(\theta\) up keeps the boundary but pushes every probability towards 0 or 1, which always increases the likelihood of separable data. So \(\|\theta\| \to \infty\) and the model becomes infinitely confident, which is badly wrong on new borderline cases. L2 regularisation (lesson 3.4) keeps \(\theta\) finite.</p>`}
  ],
  quiz:[
    {q:"In logistic regression, what is linear in the features?", o:["The probability","The log-odds","The odds","The loss"], a:1, why:"log(p / (1 - p)) = theta^T x; the probability itself is the sigmoid of that."},
    {q:"A weight of 0.7 on a 0/1 feature means switching the feature on:", o:["Adds 0.7 to the probability","Multiplies the odds by e^0.7, about 2","Multiplies the probability by 0.7","Sets the probability to 0.7"], a:1, why:"It adds 0.7 to the log-odds, so the odds are multiplied by e^0.7 ≈ 2.01."},
    {q:"The decision boundary of logistic regression with raw features is:", o:["A circle","A hyperplane where theta^T x = 0 (for threshold 0.5)","Wherever the sigmoid is steepest, which depends on the data","Not defined"], a:1, why:"sigma(theta^T x) >= 0.5 exactly when theta^T x >= 0, a linear boundary."}
  ]
},
{
  id:"4-2", title:"Cross-entropy loss and its gradient", mins:30,
  objectives:[
    "Derive the logistic loss as a negative log-likelihood",
    "Derive its gradient, \\(\\frac1n X^\\top(\\sigma(X\\theta) - y)\\), step by step",
    "Explain why the loss is convex and why squared error would be a poor choice here",
    "Train logistic regression by gradient descent with a numerically stable loss",
  ],
  prereqs:"<p>Lessons 2.3 (cross-entropy), 2.4 (maximum likelihood), 3.1, 3.3 and 4.1.</p>",
  body:h`
<h3>1. The likelihood</h3>
<p>The model says \(P(y = 1 \mid x) = h\) where \(h = \sigma(\theta^\top x)\). Both cases fit in one formula, the Bernoulli PMF:</p>
\[P(y \mid x; \theta) = h^{y}(1 - h)^{1 - y}.\]
<p>(If \(y = 1\) it gives \(h\); if \(y = 0\) it gives \(1 - h\).) For \(n\) independent examples, the log-likelihood is</p>
\[\ell(\theta) = \sum_{i=1}^n \Big[y^{(i)} \log h^{(i)} + (1 - y^{(i)}) \log\big(1 - h^{(i)}\big)\Big].\]

<h3>2. The loss</h3>
<p>Maximising \(\ell\) is minimising its negative. Averaged over examples, that is the <b>binary cross-entropy</b> (log loss):</p>
\[J(\theta) = -\frac1n \sum_{i=1}^n \Big[y^{(i)} \log h^{(i)} + (1 - y^{(i)}) \log\big(1 - h^{(i)}\big)\Big].\]
<p>It is the cross-entropy \(H(p, q)\) of lesson 2.3 between the true label and the model's prediction. For a positive example the loss is \(-\log h\): near 0 if the model said 0.99, about 4.6 if it said 0.01. Confident mistakes cost the most.</p>

<h3>3. The gradient, step by step</h3>
<p>Take one example and write \(z = \theta^\top x\), \(h = \sigma(z)\), \(L = -[y\log h + (1-y)\log(1-h)]\). Chain rule, one link at a time:</p>
\[\frac{\partial L}{\partial h} = -\frac{y}{h} + \frac{1 - y}{1 - h}, \qquad \frac{\partial h}{\partial z} = h(1 - h), \qquad \frac{\partial z}{\partial \theta} = x.\]
<p>Multiply the first two:</p>
\[\frac{\partial L}{\partial z} = \Big(-\frac{y}{h} + \frac{1-y}{1-h}\Big) h(1-h) = -y(1 - h) + (1 - y)h = h - y.\]
<p>Everything cancels to <b>prediction minus label</b>. So \(\nabla_\theta L = (h - y)\,x\), and over the dataset:</p>
\[\nabla J(\theta) = \frac1n \sum_i \big(h^{(i)} - y^{(i)}\big)x^{(i)} = \frac1n X^\top\big(\sigma(X\theta) - y\big).\]
<p>Compare linear regression: \(\frac1n X^\top(X\theta - y)\). Same shape, with the prediction now \(\sigma(X\theta)\). This is no coincidence: both are "generalised linear models", and with the matching negative log-likelihood the gradient is always (prediction − target) × features. You will see \(h - y\) again as the gradient at the output of every neural network classifier.</p>

<h3>4. Convexity</h3>
<p>The second derivative (Hessian) is</p>
\[\nabla^2 J(\theta) = \frac1n X^\top S X, \qquad S = \operatorname{diag}\big(h^{(i)}(1 - h^{(i)})\big).\]
<p>The diagonal entries are positive, so for any vector \(v\), \(v^\top X^\top S X v = \sum_i s_i (x^{(i)\top} v)^2 \ge 0\). The loss is <b>convex</b>: any local minimum is the global one, and gradient descent with a sensible learning rate will find it. (Because \(h(1-h) \le 1/4\), the curvature is at most a quarter of linear regression's, which tells you a safe learning rate.)</p>
<p>If you had used squared error \((\sigma(z) - y)^2\) instead, the loss would not be convex, and its gradient \(2(h - y)h(1-h)\) would vanish when the model is confidently wrong (\(h \approx 0\) for \(y = 1\)), so learning would stall exactly when it is most needed. Cross-entropy's gradient \(h - y\) is largest then.</p>

<h3>5. A numerically stable implementation</h3>
<p>Computing \(\log(\sigma(z))\) directly fails: for \(z = -800\), \(e^{800}\) overflows; for \(z = 40\), \(1 - \sigma(z)\) rounds to 0 and \(\log 0 = -\infty\). Rewrite the loss in terms of \(z\):</p>
\[L = \log\big(1 + e^{z}\big) - yz = \operatorname{softplus}(z) - yz,\]
<p>and compute softplus stably as \(\max(z, 0) + \log(1 + e^{-|z|})\), which never exponentiates a large positive number:</p>
<pre>def bce_from_logits(z, y):
    return np.mean(np.maximum(z, 0) - y * z + np.log1p(np.exp(-np.abs(z))))</pre>
<p>This is why PyTorch has <code>BCEWithLogitsLoss</code> and why you should pass it raw scores, not probabilities.</p>

<h3>6. Training</h3>
<pre>for step in range(steps):
    z = X @ theta
    grad = X.T @ (sigmoid(z) - y) / n + lam * np.r_[0, theta[1:]]   # don't penalise the bias
    theta -= lr * grad</pre>
<p>Standardise features, add a little L2 (separable data, lesson 4.1), and watch the loss fall. There is no closed form here, so this is the first model you <i>must</i> train iteratively.</p>

<h3>Summary</h3>
<ul>
<li>Logistic loss = Bernoulli negative log-likelihood = binary cross-entropy.</li>
<li>\(\partial L/\partial z = h - y\), so \(\nabla J = \frac1n X^\top(\sigma(X\theta) - y)\).</li>
<li>Convex: Hessian \(\frac1n X^\top S X \succeq 0\).</li>
<li>Compute from logits with softplus; never take log of a sigmoid directly.</li>
</ul>`,
  watch:[V.cost, V.lrgd, V.lrmle],
  read:[R.cs229notes, R.d2l],
  exercise:h`<p>Implement <code>sigmoid</code>, <code>bce_from_logits</code> and <code>grad</code> in NumPy. Test the stable loss against the naive formula for \(z\) in \([-10, 10]\) (they should match) and at \(z = \pm 1000\) (only the stable one should give finite answers). Train on scikit-learn's breast-cancer dataset (standardised, 70/15/15 split) and plot training and validation loss against steps. Compare your final weights with <code>sklearn.linear_model.LogisticRegression(C=1/(n*lam))</code>; they should be close.</p>`,
  problems:[
    {q:h`<p>One example has \(x = (1, 2)\) (the 1 is the bias feature), \(y = 1\) and \(\theta = (0, -0.5)\). Compute the loss and the gradient.</p>`,
     a:h`<p>\(z = 0 - 1 = -1\), \(h = \sigma(-1) \approx 0.269\). Loss \(-\log 0.269 \approx 1.313\). \(h - y = -0.731\), so the gradient is \(-0.731 \times (1, 2) = (-0.731, -1.462)\). A gradient step increases both weights, raising \(z\) and so the probability of the correct class.</p>`},
    {q:h`<p>Verify that \(\operatorname{softplus}(z) - yz\) equals \(-[y\log\sigma(z) + (1-y)\log(1 - \sigma(z))]\).</p>`,
     a:h`<p>\(\log\sigma(z) = -\log(1 + e^{-z})\) and \(\log(1 - \sigma(z)) = \log\sigma(-z) = -\log(1 + e^{z})\). Also \(\log(1 + e^{-z}) = \log(1 + e^{z}) - z\). So the loss is \(y[\log(1 + e^{z}) - z] + (1 - y)\log(1 + e^{z}) = \log(1 + e^{z}) - yz\).</p>`},
    {q:h`<p>Using \(h(1 - h) \le 1/4\), give a learning rate that is guaranteed stable for logistic regression in terms of \(\lambda_{\max}\) of \(\frac1n X^\top X\).</p>`,
     a:h`<p>The Hessian is \(\frac1n X^\top S X\) with every \(s_i \le 1/4\), so its largest eigenvalue is at most \(\lambda_{\max}/4\). Gradient descent is stable for \(\eta < 2/(\lambda_{\max}/4) = 8/\lambda_{\max}\) (lesson 3.3). With standardised features \(\lambda_{\max}\) is often a few units, so rates around 0.5 to 1 are usually fine.</p>`}
  ],
  quiz:[
    {q:"For logistic regression with cross-entropy loss, the derivative of the loss with respect to the score z is:", o:["(h - y) h (1 - h)","h - y","y / h","log h - y"], a:1, why:"The sigmoid's derivative cancels the 1/h and 1/(1-h) terms, leaving prediction minus label."},
    {q:"Why is cross-entropy better than squared error for logistic regression?", o:["It is faster to compute","It is convex in theta, and its gradient stays large when the model is confidently wrong","It gives probabilities above 1","It needs no learning rate"], a:1, why:"Squared error through a sigmoid is non-convex and its gradient vanishes at confident mistakes."},
    {q:"Why compute the loss from logits with softplus instead of log(sigmoid(z))?", o:["It is a different loss","To avoid overflow and log(0) at large |z|","Because sigmoid is not differentiable","It is required for convexity"], a:1, why:"The two are mathematically equal, but only the softplus form is finite in floating point at extreme scores."}
  ]
},
{
  id:"4-3", title:"Evaluating classifiers: thresholds, precision, recall and ROC", mins:25,
  objectives:[
    "Build a confusion matrix and compute accuracy, precision, recall and F1",
    "Choose a threshold from the costs of each kind of error",
    "Draw and interpret ROC and precision–recall curves and the AUC",
    "Check whether a model's probabilities are calibrated",
  ],
  prereqs:"<p>Lessons 2.2 (sensitivity, specificity, PPV) and 4.1–4.2.</p>",
  body:h`
<h3>1. The confusion matrix</h3>
<p>Fix a threshold \(t\) and predict positive when \(h(x) \ge t\). Every example falls into one of four boxes: true positive (TP), false positive (FP), true negative (TN), false negative (FN). From them:</p>
\[\text{precision} = \frac{TP}{TP + FP}, \qquad \text{recall} = \frac{TP}{TP + FN}, \qquad F_1 = \frac{2 \cdot \text{precision} \cdot \text{recall}}{\text{precision} + \text{recall}}.\]
<p>These are lesson 2.2's quantities with new names: recall is sensitivity, precision is positive predictive value, and the false positive rate is \(FP/(FP + TN) = 1 - \) specificity.</p>

<h3>2. Accuracy misleads on rare classes</h3>
<p>If 1% of transactions are fraud, a model that always says "not fraud" is 99% accurate and catches nothing. Whenever classes are imbalanced, report precision and recall (or the curves below), and always state the base rate. As lesson 2.2 showed, precision depends on prevalence: the same model has lower precision in a population where positives are rarer.</p>

<h3>3. Choosing the threshold</h3>
<p>Lowering \(t\) flags more cases: recall rises, precision falls. The right \(t\) comes from the costs. Suppose a missed case costs \(c_{FN}\) and a false alarm costs \(c_{FP}\). If the model's probabilities are calibrated (section 6), flagging a case with probability \(p\) has expected cost \((1 - p)c_{FP}\) and not flagging it has expected cost \(p\,c_{FN}\). Flag when</p>
\[p \ge t^* = \frac{c_{FP}}{c_{FP} + c_{FN}}.\]
<p>If missing a sick patient is 20 times worse than an unnecessary referral, \(t^* = 1/21 \approx 0.05\). The default 0.5 is right only when both errors cost the same. In practice teams often fix a target ("recall at least 95%") and take the highest threshold that achieves it on the validation set.</p>

<h3>4. The ROC curve and AUC</h3>
<p>Sweep \(t\) from 1 down to 0 and plot recall (true positive rate) against false positive rate. That is the <b>ROC curve</b>. A useless model is the diagonal; a perfect one hugs the top-left corner. The <b>area under the curve</b> (AUC) has a clean meaning:</p>
\[\text{AUC} = P\big(h(x^+) > h(x^-)\big),\]
<p>the probability that a randomly chosen positive gets a higher score than a randomly chosen negative. It measures <b>ranking</b> quality, independent of the threshold and of prevalence. An AUC of 0.5 is chance; 0.9 is strong.</p>

<h3>5. Precision–recall curves</h3>
<p>When positives are rare, the ROC curve can look excellent while precision is poor, because the false positive <i>rate</i> stays small even when false positives outnumber true ones. The <b>precision–recall curve</b> (precision against recall as \(t\) sweeps) shows this directly, and its baseline is the prevalence, not 0.5. Use it for rare events: fraud, rare diseases, the one relevant document among thousands in retrieval.</p>

<h3>6. Calibration</h3>
<p>A model is <b>calibrated</b> if, among cases where it says 0.8, about 80% are positive. Check with a <b>reliability diagram</b>: bin predictions (0–0.1, 0.1–0.2, …), and plot the actual fraction of positives in each bin against the average prediction. Logistic regression is usually well calibrated on data like its training data, because it maximises likelihood. Large neural networks, boosted trees and LLMs asked for a "confidence" often are not. Calibration matters whenever a probability drives a decision, as in section 3, or is shown to a person.</p>

<h3>Summary</h3>
<ul>
<li>Precision = PPV, recall = sensitivity. Accuracy hides failures on rare classes.</li>
<li>Threshold from costs: \(t^* = c_{FP}/(c_{FP} + c_{FN})\), if calibrated.</li>
<li>ROC AUC = probability a positive outranks a negative. Use PR curves for rare positives.</li>
<li>Check calibration with a reliability diagram before trusting probabilities.</li>
</ul>`,
  watch:[V.roc, V.sensspec],
  read:[R.sklearn, R.calib],
  exercise:h`<p>Using your model from lesson 4.2, compute from scratch (no scikit-learn metrics) the confusion matrix at \(t = 0.5\), the ROC curve, the AUC (with the trapezium rule, and again with the pairwise-ranking definition: they should agree), and the precision–recall curve. Then pick a threshold that gives at least 98% recall on validation and report precision there. Draw a reliability diagram with 10 bins. Check your numbers against <code>sklearn.metrics</code>.</p>`,
  problems:[
    {q:h`<p>On 1,000 patients, a model gives TP = 45, FN = 5, FP = 95, TN = 855. Compute accuracy, precision, recall, specificity and F1.</p>`,
     a:h`<p>Accuracy \((45 + 855)/1000 = 0.90\). Precision \(45/140 \approx 0.32\). Recall \(45/50 = 0.90\). Specificity \(855/950 = 0.90\). F1 \(= 2(0.32)(0.90)/(1.22) \approx 0.47\). Prevalence is 5%, so even a 90%-sensitive, 90%-specific model is right about only one in three of its positives, just as lesson 2.2 predicted.</p>`},
    {q:h`<p>An unnecessary referral costs ₦5,000; a missed malaria case is estimated to cost ₦95,000 in later treatment. What threshold should a calibrated model use?</p>`,
     a:h`<p>\(t^* = 5{,}000/(5{,}000 + 95{,}000) = 0.05\). Refer anyone with a predicted probability of 5% or more.</p>`},
    {q:h`<p>Three positives score 0.9, 0.6, 0.4 and three negatives score 0.7, 0.3, 0.2. Compute the AUC from its ranking definition.</p>`,
     a:h`<p>Count the 9 positive–negative pairs where the positive scores higher. 0.9 beats all 3 negatives; 0.6 beats 0.3 and 0.2 (2); 0.4 beats 0.3 and 0.2 (2). Total 7 of 9, so AUC \(= 7/9 \approx 0.78\).</p>`}
  ],
  quiz:[
    {q:"A fraud model is 99.5% accurate where 0.5% of transactions are fraud. What can you conclude?", o:["It is excellent","Nothing yet: a model that never flags fraud gets the same accuracy","It has 99.5% recall","It is well calibrated"], a:1, why:"With a 0.5% base rate, 'always no' scores 99.5%. Look at precision and recall."},
    {q:"ROC AUC is best described as:", o:["Accuracy at threshold 0.5","The probability that a random positive scores higher than a random negative","Precision averaged over thresholds","The fraction of positives in the data"], a:1, why:"It measures ranking quality, independent of threshold and prevalence."},
    {q:"Missing a case costs 9 times more than a false alarm. With calibrated probabilities, flag when p is at least:", o:["0.5","0.9","0.1","0.01"], a:2, why:"t* = c_FP / (c_FP + c_FN) = 1 / (1 + 9) = 0.1."}
  ]
},
{
  id:"4-4", title:"Exam week: softmax, numerical stability and gradient checking", mins:30,
  objectives:[
    "Extend logistic regression to many classes with softmax and cross-entropy",
    "Derive the softmax cross-entropy gradient, \\(p - y\\)",
    "Implement log-softmax stably with the log-sum-exp trick",
    "Prove an implementation correct with a gradient check, and complete the Month 1 exam",
  ],
  prereqs:"<p>Lessons 3.1 (centred differences) and 4.1–4.3.</p>",
  body:h`
<h3>1. More than two classes</h3>
<p>Triage has several levels (self-care, see a doctor this week, see a doctor today, emergency). A language model chooses among 100,000 tokens. With \(K\) classes, give each class its own weight vector \(w_k\), stacked as rows of \(W \in \mathbb R^{K \times d}\), and compute one score per class, the <b>logits</b> \(z = Wx \in \mathbb R^K\). Turn them into probabilities with the <b>softmax</b>:</p>
\[p_k = \operatorname{softmax}(z)_k = \frac{e^{z_k}}{\sum_{j=1}^K e^{z_j}}.\]
<p>Every \(p_k\) is positive and they sum to 1. Adding the same constant to every logit changes nothing (it cancels top and bottom). With \(K = 2\), softmax reduces to the sigmoid of \(z_1 - z_2\): logistic regression is the special case. And the final layer of a language model is exactly this, with temperature dividing the logits before the softmax (the Agent track, lesson 1.3).</p>

<h3>2. The loss</h3>
<p>Write the true class as a <b>one-hot</b> vector \(y\) (1 in position \(c\), 0 elsewhere). The negative log-likelihood is the cross-entropy:</p>
\[L = -\sum_k y_k \log p_k = -\log p_c = -z_c + \log\sum_j e^{z_j}.\]

<h3>3. The gradient: \(p - y\) again</h3>
<p>From the last form, \(\partial L/\partial z_k = -[k = c] + e^{z_k}/\sum_j e^{z_j} = p_k - y_k\). So</p>
\[\nabla_z L = p - y, \qquad \nabla_W L = (p - y)\,x^\top.\]
<p>Predicted distribution minus true distribution, exactly as in lesson 4.2. For a batch, \(\nabla_W J = \frac1n (P - Y)^\top X\) with \(P\) and \(Y\) of shape \((n, K)\). This one formula trains the output layer of every classifier and every language model you will build.</p>

<h3>4. The log-sum-exp trick</h3>
<p>Logits of 1,000 make \(e^{1000}\) overflow to infinity; logits of −1,000 make every \(e^{z_j}\) underflow to 0, and then you take \(\log 0\). Since adding a constant to every logit changes nothing, subtract the largest, \(m = \max_j z_j\):</p>
\[\log\sum_j e^{z_j} = m + \log\sum_j e^{z_j - m}.\]
<p>Now the largest exponent is \(e^0 = 1\), so nothing overflows and the sum is at least 1, so the log is finite. Compute the loss from the <b>log-softmax</b> \(z_k - \operatorname{LSE}(z)\), never by taking the log of a softmax:</p>
<pre>def log_softmax(Z):                       # Z: (n, K)
    m = Z.max(axis=1, keepdims=True)
    return Z - m - np.log(np.exp(Z - m).sum(axis=1, keepdims=True))

def loss(W, X, y):                        # y: integer labels (n,)
    LP = log_softmax(X @ W.T)
    return -LP[np.arange(len(y)), y].mean()</pre>
<p>This is what <code>torch.nn.CrossEntropyLoss</code> does inside, which is why it takes logits.</p>

<h3>5. Gradient checking</h3>
<p>A wrong gradient rarely crashes. Training just goes slower or converges somewhere worse, and you may never know. So before you trust any hand-written gradient, check it against the centred difference from lesson 3.1, for every parameter (or a random sample of them in large models):</p>
\[\text{rel. error} = \frac{\|g_{\text{analytic}} - g_{\text{numeric}}\|}{\|g_{\text{analytic}}\| + \|g_{\text{numeric}}\|}.\]
<p>In float64, below \(10^{-7}\) is correct, around \(10^{-5}\) deserves a look, and above \(10^{-3}\) means a bug. Practical rules (Andrew Ng's notes): check in float64, at a random point (not at zero, where some bugs cancel), with regularisation included, and turn it off for training because it is slow. Frameworks like PyTorch compute gradients for you, but you will still write custom layers and losses, and <code>torch.autograd.gradcheck</code> is this exact test.</p>

<h3>6. The Month 1 exam</h3>
<p>You now have everything: vectors and matrices (Week 1), probability and maximum likelihood (Week 2), gradients and optimisation (Week 3), and classification (Week 4). The exam brings it together in one from-scratch implementation that you can defend line by line.</p>

<h3>Summary</h3>
<ul>
<li>Softmax turns \(K\) logits into a distribution; with \(K = 2\) it is the sigmoid.</li>
<li>Cross-entropy gradient with respect to the logits: \(p - y\).</li>
<li>Log-sum-exp: subtract the max before exponentiating; compute log-softmax directly.</li>
<li>Gradient-check every hand-written gradient; relative error below \(10^{-7}\) in float64.</li>
</ul>`,
  watch:[V.softmax, V.lse, V.gradcheck, V.gradnotes],
  read:[R.cs231n, R.d2l],
  exercise:h`<p><b>Month 1 exam: classification from scratch, with a gradient check.</b> Using only NumPy:</p>
<ol>
<li>Implement softmax regression (logits, stable log-softmax loss with L2, analytic gradient) and binary logistic regression as the \(K = 2\) case.</li>
<li>Write <code>gradcheck(loss, grad, W)</code> and show the relative error is below \(10^{-7}\) at three random points. Then plant a deliberate bug (forget the regularisation term in the gradient) and show the check catches it.</li>
<li>Train on a real dataset with at least 3 classes (scikit-learn's digits, or a synthetic triage dataset you generate with known rules). Standardise, split 70/15/15, train with mini-batch SGD, and choose the learning rate and \(\lambda\) on validation.</li>
<li>Report test accuracy, a confusion matrix, per-class precision and recall, and a reliability diagram for the top class.</li>
<li>Match scikit-learn's <code>LogisticRegression</code> to within 1 point of accuracy.</li>
</ol>
<p>Publish the notebook with a two-page write-up: the derivation of the gradient in your own words, your gradient-check results, your learning curves, and the three mistakes you made on the way and how you found them.</p>`,
  problems:[
    {q:h`<p>Logits are \(z = (2, 1, 0)\) and the true class is the first. Compute \(p\), the loss and \(\nabla_z L\).</p>`,
     a:h`<p>\(e^2 \approx 7.389\), \(e^1 \approx 2.718\), \(e^0 = 1\); sum \(\approx 11.107\). \(p \approx (0.665, 0.245, 0.090)\). Loss \(-\log 0.665 \approx 0.408\). Gradient \(p - y = (-0.335, 0.245, 0.090)\): push the true class's logit up and the others down, in proportion to how much probability they took.</p>`},
    {q:h`<p>Show that softmax with \(K = 2\) is the sigmoid of \(z_1 - z_2\).</p>`,
     a:h`<p>\(p_1 = \frac{e^{z_1}}{e^{z_1} + e^{z_2}}\). Divide top and bottom by \(e^{z_1}\): \(\frac{1}{1 + e^{-(z_1 - z_2)}} = \sigma(z_1 - z_2)\). Only the difference of the two logits matters, which is why binary logistic regression needs only one weight vector.</p>`},
    {q:h`<p>Compute \(\log(e^{1000} + e^{999})\) by hand using log-sum-exp.</p>`,
     a:h`<p>\(m = 1000\): \(1000 + \log(e^0 + e^{-1}) = 1000 + \log(1.3679) \approx 1000.313\). Computed naively, \(e^{1000}\) is infinity in float64 and the answer would be infinity.</p>`},
    {q:h`<p>Your gradient check gives relative error \(3 \times 10^{-2}\), but only for the bias entries. What is the likely bug?</p>`,
     a:h`<p>An error confined to the bias usually means the bias is treated differently in the loss and the gradient: most often, the loss doesn't penalise the bias but the gradient adds \(\lambda b\) (or the reverse), or the bias gradient forgot to average over the batch. Check the bias gradient is \(\frac1n\sum_i(p^{(i)} - y^{(i)})\), matching however the loss treats it.</p>`}
  ],
  quiz:[
    {q:"The gradient of softmax cross-entropy with respect to the logits is:", o:["p (1 - p)","p - y","log p - y","y / p"], a:1, why:"Predicted distribution minus the one-hot target, the same pattern as logistic regression."},
    {q:"Why subtract the maximum logit before exponentiating?", o:["It changes the probabilities to be more accurate","Softmax is unchanged by a constant shift, and it prevents overflow and log(0)","It makes the loss convex","It is required for the gradient to be p - y"], a:1, why:"exp(z - m) is at most 1, and the sum is at least 1, so everything stays finite."},
    {q:"Your gradient check reports relative error 1e-8 in float64. This means:", o:["The gradient is probably wrong","The analytic gradient matches the numeric one: it is almost certainly correct","You should use a larger epsilon","Training will converge in one step"], a:1, why:"In float64, below about 1e-7 means the analytic and centred-difference gradients agree."}
  ]
}
];
