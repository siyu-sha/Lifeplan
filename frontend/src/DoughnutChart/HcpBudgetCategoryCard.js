import React, { Component } from "react";
import {
    Grid,
    Card,
    CardContent,
    Button,
    CardActions, TextField,
} from "@material-ui/core";
import withStyles from "@material-ui/core/styles/withStyles";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Typography from "@material-ui/core/Typography";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import {calculatePlanItemCost} from "../budget/dashboard/hcp_BudgetDashboard";
import _ from "lodash";
import EditIcon from "@material-ui/icons/Edit";

const styles = {
  panel: { width: '100%' },
};

class HcpBudgetCategoryCard extends Component {

    findItemGroupName(hcpPlanItemGroups,id){
        for (let i=0; i < hcpPlanItemGroups.length; i++){
            if(hcpPlanItemGroups[i].hcpSupportItemGroup==id){
                return  hcpPlanItemGroups[i].name
            }
         }
        return null;
    }

    getTicked(supportitemGroup){
        let items = [];
        _.map(supportitemGroup,(item) => {
            if(document.getElementById("checkbox_"+item.hcpSupportItemGroup).checked){
                items.push(item);
            }
        });
        return(items);
    }

  render() {
    const {
        classes,
        supportcategory,
        plancategory,
        allocated,
        total,
        fixed,
        supportitems,
        saveCategoryName,
        saveItemGroupName,
        handleadd,
        handleManagement,
    } = this.props;
    const id = supportcategory.id
    const name = supportcategory.name
    // console.log(supportitems)
    return (
        <ExpansionPanel defaultExpanded>
          <ExpansionPanelSummary
            classes={{ expanded: classes.expansionPanelSummary }}
            expandIcon={<ExpandMoreIcon color="secondary" />}>
            {/*<Typography variant="h5">{supportcategory} </Typography>*/}

              <FormControlLabel
                aria-label="Acknowledge"
                onClick={event => event.stopPropagation()}
                onFocus={event => event.stopPropagation()}
                control={
                    (id<3) ? (
                        <Typography variant="h5">{name}</Typography>
                        ):(
                            <div>
                                <TextField
                                id= {"plan_category_name_" + id}
                                defaultValue={plancategory.name}
                                label={name}
                                variant="outlined"
                                // name={"name"}
                                // onChange={() =>this.categoryNameChange}
                                />
                                <Button
                                    variant="contained"
                                    size="large"
                                    style={{verticalAlign: 'bottom' }}
                                    className={classes.button}
                                    // onClick ={() =>this.onCategoryNameSave(id)}
                                    onClick ={() =>saveCategoryName(id,
                                        document.getElementById("plan_category_name_" + id).value)}
                                >
                                    <EditIcon />Save
                                </Button>
                            </div>
                        )
                }
              />
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
              {(id<3) ? (
                  <Grid container direction="column" justify="space-around" alignItems="stretch" >
                    {/*<label >*/}
                    {/*  <input type="radio" name={name} value="1"  />*/}
                    {/*         Fornightly*/}
                    {/*</label>*/}
                    {/*<label >*/}
                    {/*  <input type="radio" name={name} value="2" />*/}
                    {/*         Monthly*/}
                    {/*</label>*/}
                    {/*<label >*/}
                    {/*  <input type="radio" name={name} value="3"  />*/}
                    {/*         % of total budget*/}
                    {/*</label>*/}
                    <Grid style={{textAlign: 'right' }}>
                      <Button onClick={() => handleManagement(id)}>
                          Edit
                      </Button>
                    </Grid>
                </Grid>
                  ):(
                  <Grid container direction="column" justify="space-around" alignItems="stretch">
                      {

                          _.map(supportitems[id],(item) => {
                          return(
                              <Grid >
                                  <Checkbox style={{verticalAlign: 'bottom' }}
                                            id = {"checkbox_"+item.hcpSupportItemGroup}
                                  />
                                  <TextField
                                    id= {"plan_category_item_" + item.hcpSupportItemGroup}
                                      defaultValue={this.findItemGroupName(plancategory.hcpPlanItemGroups,item.hcpSupportItemGroup)}
                                      label={item.name}
                                      style={{width:'40%'}}
                                        margin="dense"
                                      // name={"name"}
                                      // onChange={handleChange}
                                  />
                                  <Button size="small" style={{verticalAlign: 'bottom' }} variant="contained"
                                    onClick ={() =>saveItemGroupName(id,item.hcpSupportItemGroup,
                                        document.getElementById("plan_category_item_" + item.hcpSupportItemGroup).value)}>
                                      <EditIcon />
                                      Save
                                  </Button>
                              </Grid>
                          );
                      })}
                      <Grid style={{textAlign: 'right' }}>
                          <Button onClick={() =>handleadd(id,this.getTicked(supportitems[id]))}>
                              Add New
                          </Button>
                          <Button onClick={() => this.props.openSupports()}>View Plans</Button>
                      </Grid>
                  </Grid>
              )}
          </ExpansionPanelDetails>
        </ExpansionPanel>
    );
  }
}

export default withStyles(styles)(HcpBudgetCategoryCard);