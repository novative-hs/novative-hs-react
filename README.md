# Setup ReactJS Project on Local Machine

The first thing to do is to clone the repository:

```sh
git clone https://github.com/sadia-pma/ilaaj4u-reactjs.git
cd ilaaj4u-reactjs
```

Copy package.json and package-json.lock files from template files into add Admin Folders

Then go to any Admin folder that you are going to use, let's say if we have decided to use Admin-Redux then
```sh
cd Admin-Redux
```

Then install the dependencies:
```sh
 npm install --legacy-peer-deps --save
```


Once `npm` has finished downloading the dependencies:
```sh
npm start
```
And navigate to `http://localhost:3000/`
