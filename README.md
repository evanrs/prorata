# AngelList Venture Take Home Project


## Now
To play with a deployed instance of `prorata` head over to [`prorata.vercel.app`](https://prorata.vercel.app) or gawk at the unnecessarily large gif.


[![A demo of prorata](assets/demo.gif)](https://prorata.vercel.app)

<br/>

## Later

  To run your very own instance without too much hassle you'll just need `docker`. If you already have `docker` you're free to use the included `start` script which will execute the following commands from `./website/prorata`

```sh
docker build . -t evanrs-prorata
docker run -p 3000:3000 evanrs-prorata
```

<br/>

## License

This project is [MIT licensed](./LICENSE).
