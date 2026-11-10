import type { Lesson, Resource } from "../types";

// AI engineer track, Week 21: MLOps — the life of a model in production.
// Every video was checked on YouTube (channel, length, embeddable) on 10 Nov 2026 and appears nowhere else in the course.
// Maths in \( \) or \[ \]; h`...` keeps backslashes.
const h = String.raw;
const yt = (id: string, title: string, len: string, src?: string, embed = true): Resource =>
  ({ title, len, url: `https://www.youtube.com/watch?v=${id}`, ...(src ? { src } : {}), ...(embed ? {} : { embed: false }) });

const V = {
  whatIs: yt("OejCJL2EC3k", "What is MLOps? — IBM Technology", "7 min"),
  nana: yt("biqYkVf-a7Y", "MLOps explained: what it is, why you need it and how it works — TechWorld with Nana", "26 min"),
  dvcIntro: yt("UbL7VUpv1Bs", "Version control for data science, explained in 5 minutes — DVC", "5 min"),
  dvcHands: yt("kLKBcPonMYw", "Versioning data with DVC, hands-on — DVC", "13 min"),
  mlflow: yt("6ngxBkx05Fs", "MLflow tutorial — codebasics", "51 min"),
  bento: yt("i_FtfdOKa2M", "BentoML tutorial: build production-grade AI applications — Krish Naik", "29 min"),
  cicd: yt("scEDHsr3APg", "DevOps CI/CD explained in 100 seconds — Fireship", "2 min"),
  drift: yt("QJTRNxUxmuc", "Model drift: concept drift and data drift explained — 1littlecoder", "10 min"),
  cs329s: yt("uVqfYkcodeE", "ML monitoring — Alessya Visnjic (guest lecture, published by WhyLabs)", "1 hr 36 min", "Stanford CS329S Machine Learning Systems Design"),
};

const R: Record<string, Resource> = {
  google: { title: "MLOps: continuous delivery and automation pipelines in machine learning — Google Cloud", url: "https://cloud.google.com/architecture/mlops-continuous-delivery-and-automation-pipelines-in-machine-learning" },
  mlopsOrg: { title: "ml-ops.org — principles and the MLOps lifecycle", url: "https://ml-ops.org" },
  madeWithMl: { title: "Made With ML — a free course on building and deploying ML systems", url: "https://madewithml.com" },
  dvc: { title: "DVC documentation", url: "https://dvc.org/doc" },
  mlflowDocs: { title: "MLflow documentation", url: "https://mlflow.org/docs/latest/" },
  bentoDocs: { title: "BentoML documentation", url: "https://docs.bentoml.com" },
};

export const week21: Lesson[] = [
{
  id: "21-1", title: "What MLOps is: the life of a model", mins: 20,
  objectives: [
    "Describe the stages of the machine-learning lifecycle and who owns each",
    "Explain why a model that worked in a notebook often fails in production",
    "Place a team on the MLOps maturity levels and name its next step",
  ],
  prereqs: "<p>Months 1–5 of this track. You have trained models (Month 2), fine-tuned one (Month 4) and evaluated systems (Month 5).</p>",
  body: h`
<h3>1. The notebook is not the product</h3>
<p>By now you can train, fine-tune and evaluate models. In a notebook that's enough. In a business it isn't, because the questions change: <em>Which data was this model trained on? Can we reproduce it? Who approved it? How do we update it without breaking the app? How do we know it's still right next month?</em> <b>MLOps</b> (machine-learning operations) is the set of practices that answers those questions. It borrows from DevOps (automation, CI/CD, monitoring) and adds what's special about ML: data and models change, and a model can degrade silently even when no code changed.</p>

<h3>2. The lifecycle</h3>
<ol>
<li><b>Data:</b> collect, label, clean and split it; version it so every model can be traced back to its exact data.</li>
<li><b>Experiments:</b> train many variants and record parameters, code version, data version and metrics for each run.</li>
<li><b>Model registry:</b> promote the best run to a named, versioned model with its evaluation results, and an approval step.</li>
<li><b>Deployment and serving:</b> package the model with its code and dependencies, expose it as an API, and roll it out safely.</li>
<li><b>Monitoring:</b> watch inputs, outputs, latency, cost and accuracy; alert when they drift.</li>
<li><b>Retraining:</b> feed new labelled data back in, and go round again.</li>
</ol>
<p>The loop matters more than any single step. A model is never "done"; it is maintained.</p>

<h3>3. Why models fail in production</h3>
<ul>
<li><b>Training–serving skew:</b> the preprocessing at serving time differs slightly from training (a different tokenizer version, a missing normalisation), so the model sees inputs it never learned on.</li>
<li><b>Data drift:</b> the world changes. A triage model trained on rainy-season patients meets dry-season symptoms.</li>
<li><b>Unreproducible models:</b> nobody can rebuild last month's good model, because the data and settings weren't recorded.</li>
<li><b>Silent failure:</b> unlike a crashed server, a wrong prediction raises no error. Without monitoring, nobody notices.</li>
</ul>

<h3>4. Maturity levels</h3>
<p>Google's widely used framing (linked below) describes three levels:</p>
<ul>
<li><b>Level 0, manual:</b> a person trains in a notebook and hands over a file. Fine for a first model; fragile after that.</li>
<li><b>Level 1, automated training pipeline:</b> data checks, training, evaluation and registration run as one repeatable pipeline, so retraining is a button (or a schedule), not a project.</li>
<li><b>Level 2, CI/CD for pipelines:</b> changes to the pipeline code are themselves tested and deployed automatically.</li>
</ul>
<p>Most small teams should aim for level 1. This week you'll build a level-1 pipeline for the model you fine-tuned in Month 4.</p>

<h3>Summary</h3>
<ul>
<li>MLOps makes models reproducible, deployable and observable.</li>
<li>The lifecycle is a loop: data → experiments → registry → deployment → monitoring → retraining.</li>
<li>The dangerous failures are silent ones, so monitoring is not optional.</li>
</ul>`,
  watch: [V.whatIs, V.nana],
  read: [R.google, R.mlopsOrg, R.madeWithMl],
  exercise: h`<p>Draw the lifecycle for the model you fine-tuned in Month 4 (or ClinicVox's triage model). For each of the six stages, write: what exists today, where it's stored, and who would notice if it broke. Then mark your current maturity level and the single change that would move you up one level.</p>`,
  problems: [
    {q: h`<p>A model scored 92% on the test set, but complaints start two weeks after launch. No code changed. Give three possible causes and how you'd check each.</p>`,
     a: h`<ol><li><b>Data drift:</b> compare the distribution of recent inputs with the training data (lesson 21.5).</li><li><b>Training–serving skew:</b> run the same raw input through the training preprocessing and the serving preprocessing and diff the results.</li><li><b>Test set not representative:</b> sample 50 real production cases, label them, and measure accuracy on those. A 92% test score on the wrong distribution means little.</li></ol>`},
    {q: h`<p>Which maturity level is this team at, and what's their next step? "Ada retrains the model every quarter on her laptop, then emails the file to the backend team."</p>`,
     a: h`<p>Level 0. The next step is a level-1 pipeline: one script (or workflow) that pulls a versioned dataset, trains, evaluates against the agreed test set, and registers the model with its metrics, so anyone can rerun it and the backend team pulls the model from the registry instead of email.</p>`},
  ],
  quiz: [
    {q: "What makes MLOps different from ordinary DevOps?", o: ["It uses different servers", "Data and models change, and models can degrade silently without any code change", "It doesn't use CI/CD", "It only applies to large companies"], a: 1, why: "Code can be correct while the model quietly gets worse as the data changes."},
    {q: "Training–serving skew means:", o: ["Training is slower than serving", "Inputs are prepared differently at serving time than in training", "The model is too big", "Users skip the training"], a: 1, why: "Small preprocessing differences show the model inputs it never learned on."},
    {q: "A level-1 MLOps setup has:", o: ["A notebook and an email", "An automated, repeatable training pipeline", "Fully automated CI/CD for pipeline code", "No monitoring"], a: 1, why: "Level 1 automates training, evaluation and registration so retraining is repeatable."},
  ],
},
{
  id: "21-2", title: "Data: collecting, preparing, versioning and protecting it", mins: 22,
  objectives: [
    "Version a dataset with DVC so every model traces back to its exact data",
    "Split data without leakage, including time-based splits",
    "Apply data-protection rules (Nigeria's NDPA 2023) to training data",
  ],
  prereqs: "<p>Lesson 21.1 and git basics.</p>",
  body: h`
<h3>1. Why data needs version control</h3>
<p>Git tracks code well but handles large files badly. Yet the dataset decides the model as much as the code does. If you can't say <em>exactly</em> which data a model saw, you can't reproduce it, debug it, or prove what it learned from. <b>DVC</b> (Data Version Control) solves this: the data lives in storage you choose (S3, Google Drive, a server), and git stores a tiny pointer file with the data's hash.</p>
<pre>dvc init
dvc add data/triage_notes.csv        # creates data/triage_notes.csv.dvc (a pointer)
git add data/triage_notes.csv.dvc .gitignore
git commit -m "Triage notes v1"
dvc remote add -d storage s3://my-bucket/dvc
dvc push                             # uploads the data itself</pre>
<p>Now <code>git checkout</code> any commit followed by <code>dvc pull</code> restores the exact data that commit used.</p>

<h3>2. Preparing data well</h3>
<ul>
<li><b>Clean deliberately:</b> write cleaning as code (a script in the repo), never by hand in a spreadsheet, so it can be rerun and reviewed.</li>
<li><b>Label with guidelines:</b> written rules for labellers, plus a sample labelled twice to measure agreement. If two careful people disagree 30% of the time, no model will reach 95%.</li>
<li><b>Validate:</b> automatic checks before training: expected columns, value ranges, missing-value rates, class balance. A failed check stops the pipeline.</li>
</ul>

<h3>3. Splits without leakage</h3>
<p><b>Leakage</b> is when information from the test set sneaks into training, so the score looks better than reality. Common causes: the same patient appearing in both train and test; features computed using future data; duplicates across splits. Split by <em>entity</em> (patient, customer) and, when the data has a time order, by <em>time</em>: train on January–September, test on October–November. That mimics production, where the model always predicts the future.</p>

<h3>4. Security and governance</h3>
<p>Training data is often personal data. In Nigeria the <b>Nigeria Data Protection Act 2023 (NDPA)</b> applies: you need a lawful basis (such as consent) to process personal data, should collect only what you need, keep it secure, and respect people's rights over their data. Health data is treated as sensitive. In practice:</p>
<ul>
<li>Remove or pseudonymise direct identifiers (names, phone numbers) before data reaches the training pipeline.</li>
<li>Restrict who can read raw data; log access.</li>
<li>Record where each dataset came from and under what consent: a short <b>datasheet</b> stored next to the data.</li>
<li>Have a plan for deletion requests: if a person asks to be removed, can you find their rows, and when will the model be retrained without them?</li>
</ul>
<p>This is a summary, not legal advice; for a real product, have the NDPA obligations reviewed by someone qualified.</p>`,
  watch: [V.dvcIntro, V.dvcHands],
  read: [R.dvc, R.madeWithMl],
  exercise: h`<p>This is the start of the Week 21 build. Put the dataset from your Month 4 fine-tune under DVC with a remote, add a validation script (columns, ranges, duplicates, class balance) that exits with an error when a check fails, and write a one-page datasheet: source, consent basis, personal fields removed, and how a deletion request would be handled.</p>`,
  problems: [
    {q: h`<p>Your 10,000 clinic notes come from 2,000 patients, about 5 notes each. You split notes randomly 80/20. What's wrong, and how do you fix it?</p>`,
     a: h`<p>Notes from the same patient land in both train and test, so the model can recognise the patient's writing or history instead of generalising: leakage. Split by patient: put 1,600 patients' notes in training and the other 400 patients' notes in test.</p>`},
    {q: h`<p>Two labellers each label the same 200 notes as urgent or not. They agree on 170. What's the raw agreement, and what does it tell you about the best accuracy you should expect?</p>`,
     a: h`<p>170 ÷ 200 = <b>85%</b>. When careful humans only agree 85% of the time, the labels themselves are noisy, so a model scoring much above that on those labels is suspicious. Improve the labelling guidelines (and relabel disagreements) before chasing model accuracy.</p>`},
  ],
  quiz: [
    {q: "What does git store when you `dvc add` a file?", o: ["The whole file", "A small pointer file with the data's hash", "Nothing", "A zip of the data"], a: 1, why: "The data goes to DVC storage; git keeps a pointer so commits stay small."},
    {q: "For data with a time order, the most realistic test split is:", o: ["A random 20%", "The most recent period, with training on earlier data", "The oldest 20%", "Whatever has the best score"], a: 1, why: "Production always predicts the future, so test on data after the training period."},
    {q: "Under the NDPA, a good first step for training data is:", o: ["Keep everything forever", "Remove or pseudonymise direct identifiers and record the consent basis", "Share it publicly", "Ignore it for AI"], a: 1, why: "Minimise personal data and document the lawful basis."},
  ],
},
{
  id: "21-3", title: "Experiment tracking and the model registry with MLflow", mins: 22,
  objectives: [
    "Log parameters, metrics, code and data versions for every training run",
    "Compare runs and pick a model with evidence",
    "Register, version and promote a model through a registry",
  ],
  prereqs: "<p>Lessons 21.1–21.2, and a training script from Month 2 or 4.</p>",
  body: h`
<h3>1. The problem experiment tracking solves</h3>
<p>After a week of training you have <code>model_final.pt</code>, <code>model_final_v2.pt</code> and <code>model_REALLY_final.pt</code>, and no idea which learning rate or data produced the good one. Experiment tracking records every run automatically: <b>parameters</b> (settings), <b>metrics</b> (scores), <b>artifacts</b> (the model file, plots) and the <b>code and data versions</b>.</p>

<h3>2. MLflow in five lines</h3>
<pre>import mlflow

mlflow.set_experiment("triage-classifier")
with mlflow.start_run():
    mlflow.log_params({"lr": 3e-4, "epochs": 4, "data_version": "v1 (git abc123)"})
    # ... train ...
    mlflow.log_metric("val_accuracy", 0.91)
    mlflow.log_artifact("confusion_matrix.png")</pre>
<p>Run <code>mlflow ui</code> and open <code>http://localhost:5000</code> to see every run in a table, sort by any metric, and compare runs side by side. Many libraries can also log automatically with <code>mlflow.autolog()</code>.</p>

<h3>3. Choosing a model with evidence</h3>
<p>Pick on the validation set, report on the test set (touched once, Month 2). Compare more than accuracy: latency, size and cost, and the metric that matters for the use case. For triage, missing an urgent case (a false negative) is far worse than an unnecessary escalation, so <b>recall on urgent cases</b> may matter more than overall accuracy.</p>

<h3>4. The model registry</h3>
<p>A registry turns "a run that looked good" into a named, versioned model that other systems can depend on:</p>
<pre>mlflow.register_model("runs:/&lt;run_id&gt;/model", "triage-classifier")</pre>
<p>Each registration creates a new version (1, 2, 3…) linked to the run, its data version and its metrics. Teams then mark which version is in use, typically with aliases such as <code>champion</code> (serving now) and <code>challenger</code> (being tested). The serving code loads "the champion", so promoting a new model is a registry change, not a code change, and rolling back is just as quick.</p>

<h3>5. Model cards</h3>
<p>Every registered version should carry a short <b>model card</b>: what it's for and not for, training data (with the DVC version), evaluation results including where it does badly, and who approved it.</p>`,
  watch: [V.mlflow],
  read: [R.mlflowDocs],
  exercise: h`<p>Add MLflow tracking to your Month 4 training script: log parameters, the DVC data version, metrics and the model. Run at least five variants (learning rate, LoRA rank, epochs), compare them in the MLflow UI, register the best as version 1 with a model card, and set it as <code>champion</code>.</p>`,
  problems: [
    {q: h`<p>Model A: 93% accuracy, catches 80% of urgent cases. Model B: 90% accuracy, catches 95% of urgent cases. For clinic triage, which do you register as champion?</p>`,
     a: h`<p>Probably <b>B</b>. In triage a missed urgent case is the most expensive error, so recall on the urgent class matters more than overall accuracy. A's higher accuracy likely comes from getting the many easy, non-urgent cases right. Record the reasoning in the model card, and confirm with clinicians what trade-off is acceptable.</p>`},
    {q: h`<p>Why should serving code load "the model with alias champion" rather than "version 3"?</p>`,
     a: h`<p>Promotion and rollback become a single registry change, with no code change or redeploy. If version 4 misbehaves, point <code>champion</code> back at version 3 and the service picks it up.</p>`},
  ],
  quiz: [
    {q: "Which is NOT normally logged for a run?", o: ["Parameters", "Metrics", "The data version", "The developer's password"], a: 3, why: "Never log secrets; log settings, scores, artifacts and versions."},
    {q: "What's the model registry for?", o: ["Storing training data", "Naming and versioning models, and tracking which one is in use", "Speeding up training", "Writing code"], a: 1, why: "It gives models stable names, versions, approvals and aliases."},
    {q: "You choose between models using:", o: ["The test set, many times", "The validation set; the test set is reported once at the end", "Training accuracy", "Whatever trained fastest"], a: 1, why: "Reusing the test set to choose leaks it into your decisions."},
  ],
},
{
  id: "21-4", title: "Deploying and serving models: packaging, APIs and CI/CD", mins: 22,
  objectives: [
    "Package a model with its code and dependencies and serve it as an API",
    "Roll out a new model safely with shadow, canary and rollback",
    "Write a CI/CD pipeline that tests a model before it ships",
  ],
  prereqs: "<p>Lessons 21.1–21.3, and Week 22's inference lesson is a useful companion.</p>",
  body: h`
<h3>1. From model file to service</h3>
<p>A deployable model is more than weights: it's the preprocessing, the model, the postprocessing and the exact library versions, packaged so it runs the same everywhere. Tools such as <b>BentoML</b> do this packaging and give you an HTTP API, batching and a container image. A minimal service:</p>
<pre>import bentoml

@bentoml.service
class Triage:
    def __init__(self):
        self.model = load_champion()            # e.g. from the MLflow registry

    @bentoml.api
    def predict(self, note: str) -&gt; dict:
        return {"urgent": bool(self.model(preprocess(note)))}</pre>
<p><code>bentoml serve</code> runs it locally; <code>bentoml build</code> and <code>bentoml containerize</code> produce a container image you can run on any cloud. For LLMs specifically, servers like vLLM (Week 22) handle the heavy lifting.</p>
<p>The single most important rule: <b>use exactly the same preprocessing code in training and serving</b>, imported from one module. That removes training–serving skew (21.1) at the source.</p>

<h3>2. Rolling out safely</h3>
<ul>
<li><b>Shadow:</b> the new model receives a copy of real traffic and its answers are logged, but users still get the old model's answers. Compare them offline.</li>
<li><b>Canary:</b> send a small share (say 5%) of users to the new model, watch the metrics, then increase.</li>
<li><b>Rollback:</b> keep the previous version ready; with registry aliases (21.3) it's one change.</li>
</ul>

<h3>3. CI/CD for models</h3>
<p>CI/CD (continuous integration and delivery) means every change is tested and shipped automatically. For a model service the pipeline adds ML-specific gates:</p>
<ol>
<li>Unit tests on preprocessing and the API.</li>
<li>Data validation (21.2) on any new training data.</li>
<li>The eval set from Month 5 against the candidate model, with a <b>gate</b>: block the release if accuracy drops more than an agreed margin, or if any critical case fails.</li>
<li>Build the container, deploy to staging, run a smoke test, then canary to production.</li>
</ol>`,
  watch: [V.bento, V.cicd],
  read: [R.bentoDocs, R.google],
  exercise: h`<p>Serve your registered champion with BentoML (or FastAPI if you prefer) using the same preprocessing module as training. Add a GitHub Actions workflow that runs unit tests and your eval set against the model, failing if accuracy drops by more than 2 points or any critical case fails. Then deploy a second version as a 10% canary and write down the metrics you'd watch.</p>`,
  problems: [
    {q: h`<p>Your service handles 2,000 requests a day. A 5% canary runs for 3 days. How many requests did the new model see, and is that enough to judge a model whose key error rate you expect to be about 2%?</p>`,
     a: h`<p>2,000 × 5% × 3 = <b>300 requests</b>. At a 2% error rate that's only about 6 errors, far too few to tell 2% from 3% reliably: the standard error, \(\sqrt{0.02 \times 0.98 / 300}\), is about 0.8 points. Run longer, raise the canary share, or combine the canary with a shadow comparison on all traffic.</p>`},
    {q: h`<p>The new model passes the eval set but the canary shows more complaints. Name two likely reasons.</p>`,
     a: h`<p>(1) The eval set doesn't represent live traffic (missing new kinds of input), so refresh it from production samples. (2) Training–serving skew: something differs in the serving path, such as preprocessing, a library version or truncation length. Compare raw inputs and outputs from both paths.</p>`},
  ],
  quiz: [
    {q: "In a shadow deployment, users see:", o: ["The new model's answers", "The old model's answers, while the new one is logged for comparison", "No answers", "Both answers"], a: 1, why: "Shadow mode tests on real traffic with no risk to users."},
    {q: "The best defence against training–serving skew is:", o: ["More GPUs", "Sharing one preprocessing module between training and serving", "A bigger model", "Faster CI"], a: 1, why: "If both paths run the same code, they can't drift apart."},
    {q: "An ML-specific CI gate is:", o: ["Linting", "Blocking release if the eval score drops beyond an agreed margin", "Code formatting", "Checking the README"], a: 1, why: "Model quality is tested like code correctness."},
  ],
},
{
  id: "21-5", title: "Monitoring in production: drift, alerts and retraining", mins: 22,
  objectives: [
    "Monitor inputs, outputs, latency, cost and accuracy for a live model",
    "Measure data drift with the population stability index",
    "Decide when to retrain, and close the loop safely",
  ],
  prereqs: "<p>Lessons 21.1–21.4.</p>",
  body: h`
<h3>1. What to watch</h3>
<ul>
<li><b>Service health:</b> errors, latency, throughput, cost. Standard monitoring.</li>
<li><b>Inputs:</b> are today's inputs like the training data? (length, language mix, missing fields, categories)</li>
<li><b>Outputs:</b> the share of each prediction. If "urgent" jumps from 8% to 25% overnight, something changed.</li>
<li><b>Quality:</b> accuracy on real cases. Labels often arrive late (a doctor confirms days later), so sample and label a few cases every week.</li>
</ul>

<h3>2. Two kinds of drift</h3>
<p><b>Data drift</b>: the inputs change (new clinic, new symptoms, a different phone keyboard). <b>Concept drift</b>: the right answer for the same input changes (new treatment guidelines). Data drift you can detect without labels; concept drift needs labels.</p>

<h3>3. Measuring drift: the population stability index</h3>
<p>Group a feature into bins and compare the share of data in each bin at training time (\(e_i\), expected) with now (\(a_i\), actual):</p>
\[\text{PSI} = \sum_i (a_i - e_i)\,\ln\frac{a_i}{e_i}\]
<p>A common rule of thumb: below 0.1, stable; 0.1–0.25, moderate shift, investigate; above 0.25, significant shift, act. For text, apply it to things you can bin: note length, language, predicted class, or clusters of embeddings.</p>

<h3>4. Alerts that people act on</h3>
<p>An alert should be rare, specific and owned: "PSI on note length above 0.25 for 3 days; owner: Ada; runbook: link". Alert fatigue (too many noisy alerts) is how real problems get ignored.</p>

<h3>5. Closing the loop</h3>
<p>Retrain on a schedule <em>and</em> when monitoring says so. New labelled production data flows into the versioned dataset (21.2), the pipeline trains and registers a challenger (21.3), and it goes through the same gates and canary as any release (21.4). Never let a model retrain and deploy itself with no evaluation gate: that's how one bad batch of data reaches every user.</p>`,
  watch: [V.drift, V.cs329s],
  read: [R.google, R.madeWithMl],
  exercise: h`<p>This completes the Week 21 build. Add monitoring to your served model: log every input's length and language and every prediction; compute PSI daily against the training data; and write one alert with an owner and a short runbook. Simulate drift by sending a batch of unusual inputs and confirm the alert fires. Finish with a one-page write-up of your full pipeline: data → experiments → registry → deployment → monitoring → retraining.</p>`,
  problems: [
    {q: h`<p>Note lengths fall into three bins. At training time the shares were 50%, 30% and 20%; this week they're 30%, 40% and 30%. Compute the PSI and interpret it.</p>`,
     a: h`<ol><li>Bin 1: \((0.3-0.5)\ln(0.3/0.5) = (-0.2)(-0.511) = 0.102\)</li><li>Bin 2: \((0.4-0.3)\ln(0.4/0.3) = (0.1)(0.288) = 0.029\)</li><li>Bin 3: \((0.3-0.2)\ln(0.3/0.2) = (0.1)(0.405) = 0.041\)</li></ol><p>Total ≈ <b>0.17</b>: a moderate shift. Investigate where the longer notes come from (a new clinic? a new form?) and check accuracy on a labelled sample before deciding to retrain.</p>`},
    {q: h`<p>Your inputs look exactly like the training data (low PSI), but accuracy on this month's labelled sample fell from 91% to 84%. What kind of drift is this, and what do you do?</p>`,
     a: h`<p>Concept drift: the inputs haven't changed but the correct answers have, for example because the clinic changed its triage guidelines. Update the labelling guidelines, relabel recent data under the new rules, retrain a challenger, and release it through the normal gates and canary.</p>`},
  ],
  quiz: [
    {q: "Data drift means:", o: ["The model file was corrupted", "The inputs coming in now differ from the training data", "The right answers changed", "The server is slow"], a: 1, why: "Data drift is a change in the inputs; concept drift is a change in the correct outputs."},
    {q: "A PSI of 0.32 suggests:", o: ["Everything is stable", "A significant shift that needs action", "The model is perfect", "Nothing, PSI is about latency"], a: 1, why: "Above about 0.25 is usually treated as a significant shift."},
    {q: "Why should retraining still go through evaluation gates?", o: ["It's slower otherwise", "A bad batch of data could otherwise reach every user automatically", "Gates are required by law", "It isn't necessary"], a: 1, why: "Automatic retraining without gates can ship a broken model."},
  ],
},
];
