<template>
    <div class="container-fluid margins">
        <div class="row">
            <div class="col-10">
                <input type="text" class="form-control full-width" autofocus placeholder="Enter symbol..." v-model="symbol" v-on:keyup.enter="search"/>
            </div>
            <div class="col-2">
                <input type="button" class="btn btn-primary full-width" value="Go" v-on:click="search" />
            </div>
        </div>

       <stock-quote v-bind:stock="stock" v-bind:graph="graph"></stock-quote>
       <div class="alert alert-danger" role="alert" v-if="error">
         <strong>Error!</strong> {{this.error}}
       </div>

       <p class="small bottom">Data provided for free by
        <a href="https://iexcloud.io" target="_blank">IEX</a>.
        <br/> By using this application you agree to
        <a href="https://iextrading.com/api-exhibit-a" target="_blank">IEX terms of service</a>.
       </p>

    </div>
</template>
<script>
//include the quote component
var Quote = require("./quote.vue");

//export the needed properties
module.exports = {
  //the data model (props)
  data() {
    return {
      stock: {},
      graph: {},
      error: ""
    };
  },
  //declare the included components, used in html
  components: {
    "stock-quote": Quote
  },
  methods: {
    //init method, initialize props
    init() {
      this.stock = {};
      this.graph = {};
      this.error = "";
    },
    //search method, calls API
    search() {
      let url = `https://sandbox.iexapis.com/stable/stock/${this.symbol}/quote`;

      this.init();
      this.$http
        .get(url)
        .then(this.getGraphData)
        .catch(this.handleErrors);
    },
    //gets chart data from the API
    getGraphData(result) {
      let gUrl = `https://sandbox.iexapis.com/stable/stock/${this.symbol}/chart/1m`;
      this.stock = result.data;

      this.$http
        .get(gUrl)
        .then(result => {
          this.graph = result.data;
        })
        .catch(this.handleErrors);
    },
    //method to handle errors
    handleErrors(err) {
      if (err.status === 404) {
        this.error = "The specified symbol could not be found...";
      } else {
        this.error = "There was an error retrieving the data...";
      }
    }
  }
};
</script>
<style>
.margins {
  padding: 40px 30px;
}
.full-width {
  width: 100%;
}
.small {
  font-size: 8px;
  color: #c0c0c0;
}
.bottom {
  position: absolute;
  bottom: 5px;
  margin: 0 auto;
}
</style>
