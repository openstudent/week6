export default (express, bodyParser, fs, crypto, http) => {
    const app = express();
    const CORS = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,POST,DELETE,PUT,OPTIONS",
      "Access-Control-Expose-Headers": "X-Resp,Content-Type, Accept, Access-Control-Allow-Headers, Access-Control-Expose-Headers",
      "Access-Control-Allow-Headers": "X-Resp,Content-Type, Accept, Access-Control-Allow-Headers, Access-Control-Expose-Headers"
    };

  
    app
      .use((r, res, next) => { r.res.set(CORS); next(); })
      .use(bodyParser.urlencoded({ extended: true }))
  
      .get('/login/', (req, res) => res.send('openstudent'))  

      .get('/sha1/:input', r => {
        const shasum = crypto.createHash('sha1');
        shasum.update(r.params.input);
    
        r.res.send(shasum.digest('hex'));
       })
  
      .get('/code/', (req, res) => {
        res.set({'Content-Type': 'text/plain; charset=utf-8'});
        fs.createReadStream(import.meta.url.substring(7)).pipe(res);
      })
  
      app.all('/req/', (req, res) => {
        const addr = req.method === 'POST' ? req.body.addr : req.query.addr;

        http.get(addr, (r, b = '') => {
            r
            .on('data', d => b += d)
            .on('end', () => res.send(b));
        });
      });
  
      return app;
};
