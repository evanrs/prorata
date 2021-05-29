# About this project

 - You should spend about three hours on this.
 - Please comment your code where appropriate to help us understand your decision-making.
 - Part 3 does not require coding. Instead, write your answers in the text files in the `answers` directory.

# Allocation proration tool

When we raise money for startups on AngelList, there is always a target amount that we're trying to 
raise. This amount is called the **allocation** and it represents the total amount of 
money we are allowed to raise for a particular startup. 

Suppose we have a group of investors on AngelList who invest in all deals that they see. Each of the
investors have a **requested amount**, which represents the amount of money they want to invest into
a particular deal.

When the allocation is greater than the sum of all the investors' requested amounts, everyone can 
invest what they asked for. However, when there is limited allocation we need to **prorate all of 
the available allocation** between the investors.

We want to maximize fairness, so we always use the historical **average investment amount** 
of that investor as the basis for proration. Here is a simple example: 

```
Available allocation: $100
Investor A requested to invest $150
Investor B requested to invest $50

Investor A has a historical average investment size of $100
Investor B has a historical average investment size of $25

After proration:
Investor A will invest $100 * (100 / (100 + 25)) = $80
Investor B will invest $100 * (25 / (100 + 25)) = $20
```

## Part 1 (backend)

Your mission is to build an efficient algorithm that runs through the proration logic and generates
the final breakdown of how much money investors are investing in a particular deal.

```
# Input
{
  "allocation_amount": 100,
  "investor_amounts": [
    {
      "name": "Investor A",
      "requested_amount": 100,
      "average_amount": 100
    },
    {
      "name": "Investor B",
      "requested_amount": 25,
      "average_amount": 25
    }
  ]
}

# Output
{
  "Investor A": 80,
  "Investor B": 20
}
```

Keep the following things in mind while you implement this algorithm:
1. No investor should ever have a final amount that is greater than what they requested.
2. No allocation should be left unused if an investor wants it.
3. All allocation should be distributed proratably based on the average investment amount of the investors.

Note that the example we gave above is a simple one. Think about all the edge cases and situations
that we could run into in practice. To help with this, we've included four example sets of inputs
and expected outputs for you to use as guidance in the `data/` folder.

## Part 2 (frontend)

Now that we have our algorithm in place, we need to build a UI that our internal team can use to 
determine how much investors are allowed to invest for a deal. Your mission is to build a simple 
web app that would allow users to submit inputs to generate the breakdown of final amounts. 

Here's a very simple wireframe to get you started, but please feel free to come up with your own
design and flow.

![Sample UI Wireframe](/wireframe.png)

## Part 3 (writing)

### Discovering a bug

Suppose we discover a bug with our algorithm and investors for two deals had incorrect
allocations. This means that some of the investors ended up investing more than they were allowed to
while others invested less than they were allowed to. One of deals happened two years ago and the 
other one happened two weeks ago. Please describe, in detail, how would you go about correcting this 
issue and how would you communicate this to the affected customers.

### Squeezed down

An angry investor sent us a note about how they keep getting squeezed down to $25K per deal even
though their requested amount is $100K. Underneath the hood, this was because there's limited
allocation (low supply) and a high volume of investors looking to invest (high demand). How should 
we communicate this to an investor in a way that minimizes the damage to our relationship with 
the investor? 

In addition, can you think of a better way we could change the proration basis logic so that 
this could potentially happen less often?   

# Setup

You may use whatever web framework or language you'd like to complete this challenge (just do it 
inside the `website/` directory). The data samples are in `data/`. Please provide us with a startup
script to run everything.

When finished, please bundle & email us a zip of the results. 
