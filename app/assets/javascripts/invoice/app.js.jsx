const MyExamplePlaceholderComponent = React.createClass({
  
  getInitialState: function() {
    return {
      loading: true
    , data: []
    , sortedData: []
    , filteredData: []
    , reviewed: []
    , limit: 50
    , inc: true
    , currentItem: { id: '', 'campaign_id': '', campaign_name: '', 
      line_item_name: '', booked_amount: '', actual_amount: '', adjustments: ''}
    , grandTotal: 0
    , renderTable: false
    , show: 'Show'
    , filter: 'Filter Invoice'
    };
  },

  handleScroll(event){
    //var table = document.getElementById('table-container').style.display = "block";
    var endofpage = window.scrollY + window.innerHeight;
    if (endofpage >= document.body.scrollHeight - 2){
      var newLimit = this.state.limit + 50;
      this.setState({limit: newLimit});
    }
  },

  componentDidMount: function() {
    window.addEventListener('scroll', this.handleScroll);
    var that = this;
    $.get('/invoice/index.json').done(function( json_data ){
      that.setState({
        loading: false,
        data: json_data
      });
    });
  },
  
  componentWillUnmount: function(){
    window.removeEventListener('scroll', this.handleScroll);
  },

  displayTable(data){
    const dataTable = data.slice(0,this.state.limit).map((item) => (
          <tr id="row-data">
            <td className="col-data" id="col-id">{item.id}</td>
            <td className="col-data" id="col-campaign-id">{item.campaign_id}</td>
            <td className="col-data" id="col-campaign-name">{item.campaign_name}</td>
            <td className="col-data" id="col-line-item-name">{item.line_item_name}</td>
            <td className="col-data" id="col-booked-amount">{(Math.round(item.booked_amount * 100)/100).toLocaleString('en-US', {style: 'currency', currency: 'USD'})}</td>
            <td className="col-data" id="col-actual-amount">{(Math.round(item.actual_amount * 100)/100).toLocaleString('en-US', {style: 'currency', currency: 'USD'})}</td>
            <td className="col-data" id="col-adjustments">{(Math.round(item.adjustments * 100) /100).toLocaleString('en-US', {style: 'currency', currency: 'USD'})}</td>
            <td className="col-data" id="col-subtotal">{(Math.round((item.actual_amount + item.adjustments) * 100) /100).toLocaleString('en-US', {style: 'currency', currency: 'USD'})}</td>
            <td className="option" id="col-options"><img id="options" src="./assets/edit.svg" onClick={() => 
              this.edit(item)}></img></td>
          </tr>
    ));
    return dataTable;
  },

  edit(item){
    // this.displayEditForm();
    this.setState({currentItem: { id: item.id, campaign_id: item.campaign_id, campaign_name: item.campaign_name, 
      line_item_name: item.line_item_name, booked_amount: item.booked_amount, actual_amount: item.actual_amount, adjustments: item.adjustments}});
    
    if (this.state.reviewed.find(id => id == item.id) == null){
      document.getElementById('edit-adjustments').style.display = "block";
    } else {
      document.getElementById('reviewed-adjustments').style.display = "block";
    }
  },

  handleSubmit(event){
    var newData = this.state.data;
    newData[this.state.currentItem.id - 1].adjustments = this.state.currentItem.adjustments;
    
    this.setState({data: newData});
    alert('Adjustment has been changed to: ' + this.state.currentItem.adjustments);
    event.preventDefault();
    if (document.getElementById("input-reviewed").checked == true) {
      this.state.reviewed.push(this.state.currentItem.id);
    } 
  },

  handleChange(event){
    this.setState({currentItem: { id: this.state.currentItem.id, campaign_id: this.state.currentItem.campaign_id, campaign_name: this.state.currentItem.campaign_name, 
      line_item_name: this.state.currentItem.line_item_name, booked_amount: this.state.currentItem.booked_amount, actual_amount: this.state.currentItem.actual_amount, adjustments: +event.target.value}});
  },

  handleFilter(event){
    this.setState({filter: event.target.value});
  },

  handleCheck(){
    var checked = document.getElementById("input-reviewed").checked;
    if (checked){
      document.getElementById("input-reviewed").checked = true;
    } else {
      document.getElementById("input-reviewed").checked = false;
    }
  },

  clear(){
    this.setState({data: this.state.data.sort(this.sortBy('id', false)), sortedData: []});
    this.showSort('');
  },
  
  filter(){

    //const regex = /\,/$$
    const filterData = this.state.data.filter(item => {
      return item.id.toString().includes(this.state.filter) ||
      item.campaign_id.toString().includes(this.state.filter) || 
      item.line_item_name.includes(this.state.filter) ||
      item.campaign_name.includes(this.state.filter) ||
      item.booked_amount.toString().includes(this.state.filter.replace(',', '').replace('$', '')) || 
      item.actual_amount.toString().includes(this.state.filter.replace(',', '').replace('$', '')) || 
      item.adjustments.toString().includes(this.state.filter.replace(',', '').replace('$', ''));
    });
    this.setState({sortedData: filterData});
  },

  calculateGrandTotal(currentData){
    var total = 0;
    if (this.state.show == 'Show'){
      currentData.map((item) => {
        total += item.actual_amount + item.adjustments;
      });
      this.setState({grandTotal: (Math.round((total) * 100) /100).toLocaleString('en-US', {style: 'currency', currency: 'USD'}), show: 'Hide'});
    } else {
      this.setState({grandTotal: 0, show: 'Show'});
    }
  },

  sortData(field){
    // var newData = this.state.data;
    // newData[0].adjustments = 1.33333333;
    // this.setState({data: newData});
    var order = false;
    var newData = this.state.data;
    newData.sort(this.sortBy(field, this.state.inc));
    if (this.state.inc == false){
      order = true;
    } else{
      order = false;
    }
    this.setState({sortedData: newData, inc: order});
    this.showSort(field);
  },

  sortBy(field, order){
    if (order == false){ //descending order
      return function(a, b){
        if (a[field] < b[field] ) {
          return -1;
        } else if (a[field] > b[field]){
          return 1;
        }
      } 
    } 
    else if (order == true){ //ascending order
      return function(a, b){
        if (a[field] > b[field] ) {
          return -1;
        } else if (a[field] < b[field]){
          return 1;
        }
      } 
    }
  },

  showSort(field){
    var sortFields = ['sort-id', 'sort-campaign_id', 'sort-campaign_name', 'sort-line_item_name', 'sort-booked_amount', 'sort-actual_amount', 'sort-adjustments'];
    sortFields.forEach ((id) => {
      if (id == 'sort-' + field){
        document.getElementById('sort-' + field).style.display = 'block';
      } else{
        document.getElementById(id).style.display = 'none';
      }
    })

  },

  render: function() {
    var that = this;
    const {
      loading
    } = that.state;

    var tableDataDisplay = '';
    var tableData = [];
    if (this.state.sortedData.length > 0){
      tableDataDisplay = this.displayTable(this.state.sortedData);
      tableData =  this.state.sortedData;
    }
    else if (this.state.sortedData.length == 0) {
      tableDataDisplay = this.displayTable(this.state.data);
      tableData = this.state.data;
    }
    return (
      <div id="page">
        <div id="nav-bar">
          Placements Teaser
        </div>
        <div id="table-header">
          <div>
            <h1 id="table-title">
              Invoice
            </h1>
            <div id="filter-container">
              <input type="text" id="input-filter" name="input-filter" value={this.state.filter} onChange={this.handleFilter}></input>
              <button onClick={this.filter}>Filter</button>
              <button onClick={this.clear}>Clear</button></div>
            </div>
        </div>

        <div id='edit-adjustments'>
          <form onSubmit={this.handleSubmit}>
            <div className="form-title" id="form-title">Edit Invoice</div>
            <div className="form-close" onClick={() => document.getElementById('edit-adjustments').style.display = 'none'}><div></div></div>

            <label><b>ID:</b> {this.state.currentItem.id}</label>
            <br></br>
            <label><b>Campaign Name:</b> {this.state.currentItem.campaign_name}</label>
            <br></br>
            <label><b>Line Item Name:</b> {this.state.currentItem.line_item_name}</label>
            <br></br>
            <label>Adjustments
            <br></br>
            <input type="number" id="input-adjustment" name="input-adjustment" value={this.state.currentItem.adjustments } onChange={this.handleChange}></input>
            </label>
            <br></br>
            <label>Mark as reviewed?
            <br></br>
            <input type="checkbox" id="input-reviewed" name="input-reviewed" value={this.state.currentItem.id } onChange={this.handleCheck}></input>
            </label>
            <br></br>
            <input id="add-song-submit" className="form-submit" type="submit"></input>
          </form>
        </div>

        <div id='reviewed-adjustments'>
          <form>
            <div className="form-title" id="form-title">Invoice Already Reviewed</div>
            <div className="form-close" onClick={() => document.getElementById('reviewed-adjustments').style.display = 'none'}><div></div></div>
            <label><b>ID:</b> {this.state.currentItem.id}</label>
            <br></br>
            <label><b>Campaign Name:</b> {this.state.currentItem.campaign_name}</label>
            <br></br>
            <label><b>Line Item Name:</b> {this.state.currentItem.line_item_name}</label>
            <br></br>
            <label><b>Adjustments</b> {this.state.currentItem.adjustments}</label>
            <br></br>
          </form>
        </div>
        
        <div id="table-container">
          <table>
            <thead>
                <tr id="col-row">
                  <th className='col-header' id="col-id" scope="col" onClick={() => this.sortData('id')}>ID
                    <img src="./assets/sort.svg" className="sort" id="sort-id"></img></th>
                  <th className='col-header' id="col-campaign-id" scope="col" onClick={() => this.sortData('campaign_id')}>Campaign ID
                    <img src="./assets/sort.svg"className="sort" id="sort-campaign_id"></img></th>
                  <th className='col-header' id="col-campaign-name" scope="col" onClick={() => this.sortData('campaign_name')}>Campaign Name
                    <img src="./assets/sort.svg" className="sort" id="sort-campaign_name"></img></th>
                  <th className='col-header' id="col-line-item-name" scope="col" onClick={() => this.sortData('line_item_name')}>Line Item Name
                    <img src="./assets/sort.svg" className="sort" id="sort-line_item_name"></img></th>
                  <th className='col-header' id="col-booked-amount" scope="col" onClick={() => this.sortData('booked_amount')}>Booked Amount
                    <img src="./assets/sort.svg" className="sort" id="sort-booked_amount"></img></th>
                  <th className='col-header' id="col-actual-amount" scope="col" onClick={() => this.sortData('actual_amount')}>Actual Amount
                    <img src="./assets/sort.svg" className="sort" id="sort-actual_amount"></img></th>
                  <th className='col-header' id="col-adjustments" scope="col" onClick={() => this.sortData('adjustments')}>Adjustments
                    <img src="./assets/sort.svg" className="sort" id="sort-adjustments"></img></th>
                  <th className='col-header' id="col-subtotal" scope="col">Sub Total</th>
                  <th className='col-header' id="col-options" scope="col"></th>
                </tr>
            </thead>
            <tbody>
              {tableDataDisplay}
            </tbody>
          </table>
        </div>

        <div id="table-footer">
          <div id="grand-total-container">
            <button id="grand-total-btn" onClick={() => this.calculateGrandTotal(tableData)}>{this.state.show} Grand Total</button>
            <br></br>
            <div id="grand-total-value">
              {this.state.grandTotal != 0 ? ('Grand-total: ' + this.state.grandTotal) : ''}
            </div>
          </div>
        </div>

      </div>
    );
  }
});

// TODO: exports pattern instead of inline usage.
(function(){
  setTimeout(function(){
    ReactDOM.render(
      <MyExamplePlaceholderComponent/>,
      $('#pio-teaser-app')[0]
    );
  }, 500);    // Janky init code, perhaps you can refactor this!
})();