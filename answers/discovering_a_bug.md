# Prompt

Suppose we discover a bug with our algorithm and investors for two deals had incorrect
allocations. This means that some of the investors ended up investing more than they were allowed to
while others invested less than they were allowed to. One of deals happened two years ago and the
other one happened two weeks ago. Please describe, in detail, how would you go about correcting this
issue and how would you communicate this to the affected customers.



# Response


### Technical Response

The first step with any bug prior to any work is to decide upon its severity. Once a severity is assigned we can then prioritize it against our in progress work. For any mission critical operation we would consider it to be Sev 1 — for a complete system failure we'd consider Sev X.

I would asses this as a Sev 1 error as it violates a core feature of the product. Failing to implement this correctly erodes trust with our most valuable customers.

Having determined a severity we can attempt to size the problem to understand the ambiguity and time risk involved in addressing. Prior to any work or research on the matter we need to be cogniscant of our assumptions about the scale of the problem. [Sever diveations] from our sizing are good indicators of both problem scope and the teams familiarity with it.

To start the work we must determine what _should_ have happened and formalize that as a test. If we can derive a more general rule we can consider parametric testing to fuzz the system and realize a more complete coverage of test cases. In either case we must at least avoid repeating our mistake and produce a concrete metric — our test — to evaluate success.

After providing concrete expectations on the systems behavior we can begin to address the problem.


### Customer Experience

In the meantime — while engineering is scrambling to address a Sev 1 error — we need to assure the customer our understanding for their grievance. [more]

To the extent that we are able we must reverse the mistake. But, this is mediated by the severity of the issue. A less severe error is subject to the teams capacity and the value of amending the issue.


### Response to the Customer

Thank you for bringing this error to our attention. We've made this a top priority, we're doing everything we can to fix the issue going forward.

While we hope no one has an experience like this on our platform we intend to do all we can bring our response in line with our values. As we work to fix this we'll be working with you and the other parties to amend the deal.

Please do not hesitate to reach out, your feedback is what makes AngelList Venture a success.
