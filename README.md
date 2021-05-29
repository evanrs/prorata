# *YATHP by Evan Schneider* 👨‍💻
Pronounced *waɪ-eɪ-tiː-eɪʧ-piː*, or Yet Another Take Home Project if you've got the syllabels to spare — this is exactly that. However on this fortutious occasion you're looking at *your* take home project, the **AngelList Venture Take Home Project**  which is definitely not a templated value for **{{IMPORTANT_PERSONS_NAME}}**

## … *on with the show*
Start playing with a deployed instance of `prorata` now — head over to [`prorata.vercel.app`](https://prorata.vercel.app) or gawk at the unnecessarily large gif.


[<img src="assets/demo.gif" style="border-radius:1rem;"/>](https://prorata.vercel.app)

<br/>

## For later, or never, it's your choice

To run your very own instance without too much hassle you'll just need `docker`. If you already have `docker` you're free to use the included `start` script which will execute the following commands from `./website/prorata`

```sh
docker build . -t evanrs-prorata
docker run -p 3000:3000 evanrs-prorata
```

Navigate to the root of this project and run `start`, like so

```sh
./start
```

And look at that, it's starting!

<br/>

## And now, some pretty pictures

<div>
  <img width="3%">
  <img src="assets/preview.png" width="45%"/>
  <img width="3%">
  <img src="assets/preview-dark-mode.png" width="45%"/>
</div>

<!-- Bet yah didn't except to see anyone polishing off this vintage -->
<div >
  The same thing, <i>but on a tiny computer</i>
  <div><img height="16px" /></div>
</div>

<div>
  <img width="3%">
  <img src="assets/mobile.png" width="45%" style="border-radius:1rem;"/>
  <img width="3%">
  <img src="assets/mobile-dark-mode.png" width="45%" style="border-radius:1rem;"/>
</div>

<br/>

Thank you for coming to my ted talk.


<br/>

## License

This project is [MIT licensed](./LICENSE).
