import React, { useEffect, useState } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import Fab from "@material-ui/core/Fab";
import api from "../../api";
import { DialogContent } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import DialogActions from "@material-ui/core/DialogActions";
import makeStyles from "@material-ui/core/styles/makeStyles";
import _ from "lodash";
import InfoIcon from "@material-ui/icons/Info";
import Tooltip from "@material-ui/core/Tooltip";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import { DARK_BLUE, LIGHT_BLUE } from "../../common/theme";
import TextField from "@material-ui/core/TextField";
import PlanItemGroupCalendarView from "./hcp_PlanItemGroupCalendarView";
import PlanAddEditor from "./hcp_PlanAddEditor";
import ManageEditor from "./hcp_ManageEditor";
import Divider from "@material-ui/core/Divider";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import InputAdornment from "@material-ui/core/InputAdornment";
import SearchIcon from "@material-ui/icons/Search";
import classNames from "classnames";
import { calculateAllocated, calculateTotalCost } from "./hcp_BudgetDashboard";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Toolbar from "@material-ui/core/Toolbar";
import DoughnutBody from "../../DoughnutChart/DoughnutBody";
import PlanItemEditView from "./hcp_PlanItemEditView";
import {
  getHours,
  getMinutes,
  setHours,
  setMinutes,
  // parseISO,
  // format,
} from "date-fns";
import moment from "moment";

export const PLAN_ITEM_GROUPS_VIEW = 0;
export const SUPPORTS_SELECTION = 1;
export const PLAN_ITEM_GROUP_CALENDAR_VIEW = 2;
export const SUPPORT_ITEMS_VIEW = 3;
export const REGISTRATION_GROUPS_VIEW = 4;
export const PLAN_ITEM_EDIT_VIEW = 5;
export const MANAGEMENT_EDIT = 6;

export const PLAN_ITEM_GROUP_EDIT_ALL = true;

const useStyles = makeStyles((theme) => ({
  dialogTitle: {
    backgroundColor: DARK_BLUE,
    color: "white",
  },
  dialogContent: {
    minHeight: 400,
  },
  buttonText: {
    textTransform: "none",
  },
  supportButtonLight: {
    backgroundColor: LIGHT_BLUE,
    color: "white",
    width: "100%",
    maxHeight: "72px",
    minHeight: "72px",
  },
  supportButtonDark: {
    backgroundColor: DARK_BLUE,
    color: "white",
    width: "100%",
    maxHeight: "72px",
    minHeight: "72px",
  },
  icon: {
    height: "150",
  },
  list: {
    padding: 8,
  },
  blackButton: {
    backgroundColor: "black",
    color: "white",
  },
  form: {
    width: "100%",
    marginTop: theme.spacing(1),
  },
  main: {
    width: "auto",
    display: "block",
    marginLeft: theme.spacing(3),
    marginRight: theme.spacing(3),
    [theme.breakpoints.up(400 + theme.spacing(3 * 2))]: {
      width: 400,
      marginLeft: "auto",
      marginRight: "auto",
    },
  },
  planItemText: {
    textAlign: "left",
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  appBar: {
    position: "relative",
  },
}));

function dateToString(date) {
  return moment(date).format("YYYY-MM-DD");
}

export default function SupportItemDialog(props) {
  const {
      hcpPlanCategory,
      hcpSupportCategory,
      onEditHcpPlanItemGroups,
      hcpRegistrationGroups,
      activeCategory,
      page,
      setPage,
      editedItems,
      itemNames,
  } = props;

  const [indexOfItems,setindexOfItems] = useState(0);
  // React Hooks
  // list of all support hcpItems for this group
  const [hcpSupportItems, setHcpSupportItems] = useState([]);
  // id of registration group
  // const [hcpRegistrationGroupId] = useState(null);
  // 0: large screen; 1: small screen (mobile)
  // number representing current page
  // 0: supports list; 1: supports selection; 2: edit support; 3: add support
  // const [page, setPage] = useState(
  //   openAddSupports === 0 ? SUPPORTS_LIST : SUPPORTS_SELECTION
  // );
  // set of support returned from search
  const [searchResults, setSearchResults] = useState([]);
  // text typed into search bar
  const [searchText, setSearchText] = useState("");
  // item that is being edited
  const [editedItemtest, setEditedItem] = useState(0);
  const [selectedHcpPlanItemGroup, setHcpSelectedPlanItemGroup] = useState(0);

  const [activeitemid,setactiveitemid] = useState(0);

  const [registrationGroupIdFilter, setRegistrationGroupIdFilter] = useState(
    ""
  );


  const [editHcpPlanItemGroupOptions, setEditPlanItemGroupOptions] = useState({
    editAll: false,
    hcpPlanItem: null,
  });

  // const currentUser = useSelector(state => state.auth.currentUser);

  const classes = useStyles();

  // api call to load support hcpItems
  useEffect(() => {
    // if (hcpSupportCategory.id === 3) {
    //   // load all categories under core supports
    //   let hcpItems = [];
    //   // TODO: no magic numbers
    //   const body = {
    //     // birthYear: birthYear,
    //     // postcode: postcode,
    //     hcpRegistrationGroupId,
    //   };
    //   Promise.all([
    //     api.Hcp_SupportItemGroups.get({ ...body, hcpSupportCategoryID: 3 }),
    //   ]).then((responses) => {
    //     _.map(responses, (response) => {
    //       const newItems = response.data.map((hcpSupportItem) => {
    //         return {
    //           ...hcpSupportItem,
    //           label: hcpSupportItem.name,
    //         };
    //       });
    //       hcpItems = [...hcpItems, ...newItems];
    //     });
    //     setHcpSupportItems(hcpItems);
    //     setSearchResults(hcpItems);
    //   });
    // } else {
      // load single category
      console.log("SIDialog try get support item ln 198")
      api.Hcp_SupportItems.get({
        // birthYear: birthYear,
        // postcode: postcode,
        hcpsupportCategoryID: hcpSupportCategory.id,
        // hcpRegistrationGroupId,
      }).then((response) => {
        console.log('response.data');
        console.log(response.data);
        const hcpItems = response.data.map((hcpSupportItem) => {
          return {
            ...hcpSupportItem,
            label: hcpSupportItem.name,
          };
        });

        setHcpSupportItems(hcpItems);
        setSearchResults(hcpItems);
      });
    // }
  // }, [birthYear, postcode, hcpSupportCategory, hcpRegistrationGroupId]);
  }, [hcpSupportCategory ]);

  // useEffect(() => {
  //   if (registrationGroupIdFilter !== "") {
  //     setSearchResults(
  //       _.filter(hcpSupportItems, {
  //         hcpRegistrationGroupId: registrationGroupIdFilter,
  //       })
  //     );
  //   } else {
  //     setSearchResults(hcpSupportItems);
  //   }
  // }, [registrationGroupIdFilter, hcpSupportItems]);

  useEffect(() => {
    setSearchResults(
      hcpSupportItems.filter((s) =>
        s.name.toLowerCase().includes(searchText.toLowerCase())
      )
    );
  }, [searchText, hcpSupportItems]);

  const supportItemsGroupedByRegistrationGroup = _.groupBy(
    hcpSupportItems,
    "hcpRegistrationGroupId"
  );

  function goToSupportsList() {
    setPage(PLAN_ITEM_GROUPS_VIEW);
  }

  function goToSupportSelection() {
    setPage(SUPPORTS_SELECTION);
  }

  function goToPlanItemGroupCalendarView() {
    setPage(PLAN_ITEM_GROUP_CALENDAR_VIEW);
  }

  function goToAddSupport() {
    setPage(SUPPORT_ITEMS_VIEW);
  }

  function goToEditPlanItem(editOptions) {
    setEditPlanItemGroupOptions(editOptions);
    setPage(PLAN_ITEM_EDIT_VIEW);
  }

  function handleClose() {
    props.onClose();
  }

  function handleSelectRegistrationGroup(hcpRegistrationGroupId) {
    setRegistrationGroupIdFilter(hcpRegistrationGroupId);
    goToSupportSelection();
  }

  function handleAddPlanItemGroup(hcpPlanItemGroup) {
    const { hcpPlanItemGroups } = hcpPlanCategory;
    // console.log("add test");
    // console.log(hcpPlanCategory);
    // TODO: handle registered users
    if (hcpPlanCategory.hcpPlan !== undefined || hcpPlanCategory.id !== undefined) {
      let planId = hcpPlanCategory.plan;
      let hcpPlanCategoryId = hcpPlanCategory.id;
      const hcpPlanItemGroupData = {
        hcpPlanCategory: hcpPlanCategory.id,
        hcpSupportItemGroup: hcpPlanItemGroup.hcpSupportItemGroup,
        name: hcpPlanItemGroup.name,
        nickname: hcpPlanItemGroup.nickname,
      };

      console.log("SIDialog 尝试create  Hcp_PlanItemGroups： ln 290")
      console.log({planId, hcpPlanCategoryId, hcpPlanItemGroupData})
      console.log(hcpPlanItemGroup.hcpPlanItems)
      api.Hcp_PlanItemGroups.create(planId, hcpPlanCategoryId, hcpPlanItemGroupData).then(
        (response) => {
          let hcpPlanItemGroupId = response.data.id;
          for (let i = 0; i < hcpPlanItemGroup.hcpPlanItems.length; i++) {
            const hcpPlanItemData = {
              planItemGroup: hcpPlanItemGroupId,
              name: hcpPlanItemGroup.name,
              priceActual: hcpPlanItemGroup.hcpPlanItems[i].priceActual,
              startDate: dateToString(hcpPlanItemGroup.hcpPlanItems[i].startDate),
              endDate: dateToString(hcpPlanItemGroup.hcpPlanItems[i].endDate),
              allDay: hcpPlanItemGroup.hcpPlanItems[i].allDay,
            };

            console.log("SIDialog 尝试create  Hcp_PlanItems： ln 304")
            console.log(hcpPlanItemData )
            api.Hcp_PlanItems.create(
              planId,
              hcpPlanCategoryId,
              hcpPlanItemGroupId,
              hcpPlanItemData
            ).then((response) => {
              // onEditHcpPlanItemGroups([hcpPlanItemGroup, ...hcpPlanItemGroups]);
            });
          }
        }
      );
    }

    onEditHcpPlanItemGroups(hcpSupportCategory.id, [
        hcpPlanItemGroup,
        ...hcpPlanItemGroups]);
  }

  function handleSelectSupportItem(hcpSupportItem) {
    // const hcpPlanItem = {
    //   supportItemId: hcpSupportItem.id,
    //   quantity: 1,
    //   price_actual: hcpSupportItem.price,
    //   name: hcpSupportItem.name
    // };
    // const { hcpPlanItems } = hcpPlanCategory;
    // setPlanItems([hcpPlanItem, ...hcpPlanItems]);

    // goToSupportsList();

    setEditedItem(hcpSupportItem);
    goToAddSupport();

    //saveToLocalStorage(hcpPlanItems);
  }

  function handleEditSupportItem(hcpSupportItem, hcpPlanItemGroup) {
    setEditedItem(hcpSupportItem);
    setHcpSelectedPlanItemGroup(hcpPlanItemGroup);
    setEditPlanItemGroupOptions({
      editAll: PLAN_ITEM_GROUP_EDIT_ALL,
      hcpPlanItem: hcpPlanItemGroup.hcpPlanItems[0],
    });
    goToPlanItemGroupCalendarView();
  }

  function handleSearch(e) {
    setSearchText(e.target.value);
  }

  function handleDeletePlanItemGroup(hcpPlanItemGroup) {
    goToSupportsList();
    onEditHcpPlanItemGroups(
      hcpSupportCategory.id,
      _.difference(hcpPlanCategory.hcpPlanItemGroups, [hcpPlanItemGroup])
    );
  }

  function handleDeletePlanItem(hcpPlanItem) {
    const editedHcpPlanItemGroup = {
      ...selectedHcpPlanItemGroup,
      hcpPlanItems: _.difference(selectedHcpPlanItemGroup.hcpPlanItems, [hcpPlanItem]),
    };
    onEditHcpPlanItemGroups(
      hcpSupportCategory.id,
      hcpPlanCategory.hcpPlanItemGroups.map((pIG) => {
        if (selectedHcpPlanItemGroup === pIG) {
          return editedHcpPlanItemGroup;
        } else {
          return pIG;
        }
      })
    );
    setHcpSelectedPlanItemGroup(editedHcpPlanItemGroup);
  }

  function handleEditPlanItem(hcpPlanItem) {
    let editedHcpPlanItemGroup = {};
    if (editHcpPlanItemGroupOptions.editAll === true) {
      const { nickname,name, priceActual } = hcpPlanItem;
      const startDate = new Date(hcpPlanItem.startDate);
      const endDate = new Date(hcpPlanItem.endDate);
      editedHcpPlanItemGroup = {
        ...selectedHcpPlanItemGroup,
        hcpPlanItems: selectedHcpPlanItemGroup.hcpPlanItems.map((pI) => {
          return {
            ...pI,
            name,
            priceActual,
            startDate: setMinutes(
              setHours(new Date(pI.startDate), getHours(startDate)),
              getMinutes(startDate)
            ),
            endDate: setMinutes(
              setHours(new Date(pI.startDate), getHours(endDate)),
              getMinutes(endDate)
            ),
          };
        }),
        nickname : nickname,
      };
    } else {
      let {nickname}=hcpPlanItem;
      editedHcpPlanItemGroup = {
        ...selectedHcpPlanItemGroup,
        hcpPlanItems: selectedHcpPlanItemGroup.hcpPlanItems.map((pI) => {
          if (pI === editHcpPlanItemGroupOptions.hcpPlanItem) {
            return hcpPlanItem;
          } else {
            return pI;
          }
        }),
      };
    }

    onEditHcpPlanItemGroups(
      hcpSupportCategory.id,
      hcpPlanCategory.hcpPlanItemGroups.map((pIG) => {
        if (selectedHcpPlanItemGroup === pIG) {
          return editedHcpPlanItemGroup;
        } else {
          return pIG;
        }
      })
    );
    setHcpSelectedPlanItemGroup(editedHcpPlanItemGroup);
    setEditPlanItemGroupOptions({
      editAll: !PLAN_ITEM_GROUP_EDIT_ALL,
      hcpPlanItem: null,
    });
    goToPlanItemGroupCalendarView();
  }

  function handleNextItem () {
    setindexOfItems(indexOfItems+1);
  }
  function handleBack () {
    if(indexOfItems==0 || page ===MANAGEMENT_EDIT ){
      props.onClose();
    }else{
      setindexOfItems(indexOfItems-1);
    }
  }
  function renderPlanItemsByGroup(hcpPlanItemGroup) {
    let hcpSupportItem;
    if (page === PLAN_ITEM_GROUPS_VIEW) {
      hcpSupportItem = _.find(hcpSupportItems, (hcpSupportItem) => {
        return hcpSupportItem.hcpSupportItemGroup === hcpPlanItemGroup.hcpSupportItemGroup;
      });
    } else if (page === SUPPORTS_SELECTION) {
      hcpSupportItem = _.find(hcpSupportItems, (hcpSupportItem) => {
        return hcpSupportItem.id === hcpPlanItemGroup.id;
      });
    }
    let hcpPlanItems = hcpPlanItemGroup.hcpPlanItems
    if(hcpPlanItems && hcpPlanItems.length>0){
        return (
          hcpSupportItem != null && (
            <Grid item>
              <Grid container>
                <Fab
                  className={
                    page === SUPPORTS_SELECTION
                      ? classes.supportButtonLight
                      : classes.supportButtonDark
                  }
                  variant="extended"
                  onClick={() => {
                    if (page === SUPPORTS_SELECTION) {
                      handleSelectSupportItem(hcpSupportItem);
                    }
                    if (page === PLAN_ITEM_GROUPS_VIEW) {
                      handleEditSupportItem(hcpSupportItem, hcpPlanItemGroup);
                    }
                  }}
                >
                  <ListItemIcon>
                    <Tooltip
                      disableTouchListener
                      title={hcpSupportItem.description || "No description"}
                    >
                      <InfoIcon />
                    </Tooltip>
                  </ListItemIcon>
                  <Grid container alignContent="space-between">
                    <Grid item xs={10}>
                      <Typography
                          className={classNames(
                              classes.buttonText,
                              classes.planItemText
                          )}
                      >
                        {hcpPlanItemGroup.nickname}
                      </Typography>
                    </Grid>
                    {page === PLAN_ITEM_GROUPS_VIEW && (
                      <Grid item>${calculateTotalCost(hcpPlanItemGroup)}</Grid>
                    )}
                  </Grid>
                </Fab>
              </Grid>
            </Grid>
          )
        );
    }

  }

  function renderSupportItemList(list) {
    return (
      <Grid container>
        <Grid container item xs={12} md={8} lg={7} alignItems="flex-start">
          {list.length === 0 ? (
            <div> No plan </div>
          ) : (
            list.map((hcpPlanItemGroup, index) => (
              <Grid item key={index} xs={12} className={classes.list}>
                {renderPlanItemsByGroup(hcpPlanItemGroup)}
              </Grid>
            ))
          )}
        </Grid>

        {/*<Grid item md={4} lg={5}>*/}
        {/*  <DoughnutBody*/}
        {/*    // allocated={calculateAllocated(hcpPlanCategory.hcpPlanItemGroups)}*/}
        {/*    allocated='1000'*/}
        {/*    total={parseFloat(hcpPlanCategory.budget)}*/}
        {/*  />*/}
        {/*</Grid>*/}
      </Grid>
    );
  }

  function renderPlanContent() {
    return (
      <>
        <DialogContent className={classes.dialogContent}>
          {renderSupportItemList(hcpPlanCategory.hcpPlanItemGroups)}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </>
    );
  }

  function renderSelectionContent() {
    return (
      <>
        <DialogContent>
          <Grid container spacing={1}>
            <Grid item xs={12} lg={6} xl={8}>
              <TextField
                id={"support-item-select"}
                label={"Search for support hcpItems"}
                value={searchText}
                fullWidth
                onChange={handleSearch}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} lg={6} xl={4}>
              <FormControl fullWidth>
                <InputLabel>Registration Group Filter</InputLabel>
                <Select
                  value={registrationGroupIdFilter}
                  onChange={(event) => {
                    setRegistrationGroupIdFilter(event.target.value);
                  }}
                >
                  {_.map(
                    supportItemsGroupedByRegistrationGroup,
                    (hcpSupportItems, key) => {
                      const hcpRegistrationGroupId = parseInt(key);
                      return (
                        <MenuItem
                          key={hcpRegistrationGroupId}
                          value={hcpRegistrationGroupId}
                        >
                          {
                            _.find(hcpRegistrationGroups, {
                              id: hcpRegistrationGroupId,
                            }).name
                          }
                        </MenuItem>
                      );
                    }
                  )}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Divider />
              {renderSupportItemList(searchResults)}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={goToSupportsList}>Back</Button>
          <Button onClick={goToSupportsList}>Save</Button>
        </DialogActions>
      </>
    );
  }

  function renderPlanItemGroupCalendarView() {
    return (
      editHcpPlanItemGroupOptions.hcpPlanItem != null && (
        <Grid container>
          <PlanItemGroupCalendarView
            hcpPlanItemGroup={selectedHcpPlanItemGroup}
            onDeletePlanItemGroup={handleDeletePlanItemGroup}
            onDeletePlanItem={handleDeletePlanItem}
            back={goToSupportsList}
            onEditPlanItem={goToEditPlanItem}
            hcpPlanItem={editHcpPlanItemGroupOptions.hcpPlanItem}
            onSave={handleEditPlanItem}
          />
        </Grid>
      )
    );
  }

  function renderAdditionPage() {
    let planItemGroupList = editedItems;
    console.log("渲染 add界面");
    if(editedItems.length>0){
      return (
        <PlanAddEditor
          hcpSupportItems={[editedItems[0]]}
          defaultnames={itemNames}
          index = {indexOfItems}
          hcpSupportItem = {editedItems[indexOfItems]}
          redirectSelectionPage={goToSupportSelection}
          redirectSupports={goToSupportsList}
          next = {handleNextItem}
          back ={handleBack}
          save={handleAddPlanItemGroup}
        />
      );
    }
  }

  function handleManageSave(hcpPlanItemGroup) {
    const {hcpPlanItemGroups} = hcpPlanCategory;

    if (hcpPlanCategory.hcpPlan !== undefined || hcpPlanCategory.id !== undefined) {
      let planId = hcpPlanCategory.plan;
      let hcpPlanCategoryId = hcpPlanCategory.id;
      const hcpPlanItemGroupData = {
        hcpPlanCategory: hcpPlanCategory.id,
        hcpSupportItemGroup: hcpPlanItemGroup.hcpSupportItemGroup,
        name: hcpPlanItemGroup.name,
        nickname: hcpPlanItemGroup.nickname,
      };

      console.log("尝试create pIG for management");
      console.log(hcpPlanItemGroupData);
      api.Hcp_PlanItemGroups.create(planId, hcpPlanCategoryId, hcpPlanItemGroupData).then(
        (response) => {
          let hcpPlanItemGroupId = response.data.id;
          for (let i = 0; i < hcpPlanItemGroup.hcpPlanItems.length; i++) {
            const hcpPlanItemData = {
              planItemGroup: hcpPlanItemGroupId,
              name: hcpPlanItemGroup.name,
              priceActual: hcpPlanItemGroup.hcpPlanItems[i].priceActual,
              startDate: dateToString(hcpPlanItemGroup.hcpPlanItems[i].startDate),
              endDate: dateToString(hcpPlanItemGroup.hcpPlanItems[i].endDate),
              allDay: hcpPlanItemGroup.hcpPlanItems[i].allDay,
            };
            console.log("尝试create pI for management");
            console.log(hcpPlanItemData)
            api.Hcp_PlanItems.create(
              planId,
              hcpPlanCategoryId,
              hcpPlanItemGroupId,
              hcpPlanItemData
            ).then((response) => {
              // onEditHcpPlanItemGroups([hcpPlanItemGroup, ...hcpPlanItemGroups]);
            });
          }
        }
      );

    onEditHcpPlanItemGroups(activeCategory, [hcpPlanItemGroup]);

    }
  }

  function renderManagePage() {
      return (
        <ManageEditor
          manageItemGroup={hcpPlanCategory.hcpPlanItemGroups}
          redirectSelectionPage={goToSupportSelection}
          redirectSupports={goToSupportsList}
          categoryId = {activeCategory}
          next = {handleNextItem}
          back ={handleBack}
          save={handleManageSave}
        />
      );
    }

  function renderPlanItemEditView() {
    return (
      editHcpPlanItemGroupOptions.hcpPlanItem != null && (
        <PlanItemEditView
          back={goToSupportsList}
          hcpPlanItem={editHcpPlanItemGroupOptions.hcpPlanItem}
          onSave={handleEditPlanItem}
        />
      )
    );
  }

  function renderRegistrationGroupSelection() {
    return (
      <>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography>Please select a Registration Group</Typography>
            </Grid>
            {/* TODO improve performance */}
            {_.map(
              supportItemsGroupedByRegistrationGroup,
              (hcpSupportItems, key) => {
                const registrationGroup = _.find(hcpRegistrationGroups, {
                  id: parseInt(key),
                });
                return (
                  <Grid item xs={12} xl={6} key={registrationGroup.id}>
                    <Button
                      size="large"
                      variant="contained"
                      fullWidth
                      className={classes.buttonText}
                      onClick={() =>
                        handleSelectRegistrationGroup(registrationGroup.id)
                      }
                    >
                      {registrationGroup.name}
                    </Button>
                  </Grid>
                );
              }
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </>
    );
  }

  let content;
  if (page === PLAN_ITEM_GROUPS_VIEW) {
    content = renderPlanContent();
  } else if (page === SUPPORTS_SELECTION) {
    content = renderSelectionContent();
  } else if (page === PLAN_ITEM_GROUP_CALENDAR_VIEW) {
    content = renderPlanItemGroupCalendarView();
  } else if (page === SUPPORT_ITEMS_VIEW) {
    content = renderAdditionPage();
  } else if (page === PLAN_ITEM_EDIT_VIEW) {
    content = renderPlanItemEditView();
  } else if (page === MANAGEMENT_EDIT) {
    content = renderManagePage();
  } else {
    content = renderRegistrationGroupSelection();
  }

  return (
    <Dialog fullScreen open={props.open} onClose={handleClose}>
      <DialogTitle className={classes.dialogTitle}>
        <Toolbar variant="dense">
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleClose}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            {hcpSupportCategory.name}
          </Typography>
        </Toolbar>
      </DialogTitle>
      {content}
    </Dialog>
  );
}
