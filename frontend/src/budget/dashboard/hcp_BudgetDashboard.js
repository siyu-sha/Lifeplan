import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Grid,
} from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import CloseIcon from "@material-ui/icons/Close";
import { differenceInMinutes, setMonth } from "date-fns";
import _ from "lodash";
import React from "react";
import connect from "react-redux/es/connect/connect";
import api from "../../api";
import { LocalStorageKeys } from "../../common/constants";
import { DARK_BLUE, LIGHT_BLUE } from "../../common/theme";
import HcpBudgetCategoryCard from "../../DoughnutChart/HcpBudgetCategoryCard";
import BudgetCategoryCard from "../../DoughnutChart/BudgetCategoryCard";
import DoughnutBody from "../../DoughnutChart/hcp_DoughnutBody";
import BudgetCategorySection from "./hcp_BudgetCategorySection";
import SupportItemDialog, {SUPPORT_ITEMS_VIEW,
PLAN_ITEM_GROUPS_VIEW,
  REGISTRATION_GROUPS_VIEW,
  MANAGEMENT_EDIT,} from "./hcp_SupportItemDialog";

import "react-calendar/dist/Calendar.css";
import TwelveMonthCalendar from "./hcp_TwelveMonthCalendar";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import PlanItemCalendarDialog from "./PlanItemCalendarDialog";
import PlanItemDeleteDialog from "./PlanItemDeleteDialog";
import PlanItemEditView from "./PlanItemEditView";
import styles from "./BudgetDashboard.module.css";
import moment from "moment";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Typography from "@material-ui/core/Typography";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import PlanAddEditor from "./hcp_PlanAddEditor";
import FormControlLabel from "@material-ui/core/FormControlLabel";

const PLAN_CATEGORIES = "hcpPlanCategories";

function mapStateToProps(state) {
  return {
    currentUser: state.auth.currentUser,
  };
}
export function calculatePlanItemCost(hcpPlanItem) {
  const amount =
    hcpPlanItem.allDay !== null
      ? Math.round(hcpPlanItem.priceActual * 100) / 100
      : Math.round(
          ((hcpPlanItem.priceActual *
            differenceInMinutes(
              new Date(hcpPlanItem.endDate),
              new Date(hcpPlanItem.startDate)
            )) /
            60) *
            100
        ) / 100;
  return amount;
}

export function calculateTotalCost(hcpPlanItemGroup) {
  let allocated = 0;
  _.forEach(hcpPlanItemGroup.hcpPlanItems, (hcpPlanItem) => {
    const amount = calculatePlanItemCost(hcpPlanItem);

    allocated += amount;
  });
  return Math.round(allocated * 100) / 100;
}

export function calculateAllocated(hcpPlanItemGroups) {
  let allocated = 0;
  _.forEach(hcpPlanItemGroups, (hcpPlanItemGroup) => {
    allocated += calculateTotalCost(hcpPlanItemGroup);
  });

  return Math.round(allocated * 100) / 100;
}

export function planItemGroupToEvents(hcpPlanItemGroup) {
  const events =
    hcpPlanItemGroup.hcpPlanItems &&
    hcpPlanItemGroup.hcpPlanItems.map((hcpPlanItem) => {
      const { allDay, endDate, name, startDate } = hcpPlanItem;
      return {
        allDay,
        start: new Date(startDate),
        end: new Date(endDate),
        title: name,
        hcpPlanItem,
      };
    });
  return events;
}

const PLAN_ITEM_DIALOG_PAGES = {
  preview: 0,
  delete: 1,
  edit: 2,
};

function dateToString(date) {
  return moment(date).format("YYYY-MM-DD");
}

class hcp_BudgetDashboard extends React.Component {
  state = {
    hcpSupportGroups: [],
    hcpSupportItems: [],
    activeItems:[],
    planDates: {},
    planName: null,
    hcpPlanCategories: {},
    oldPlanCategories:{},
    hcpPlanItemGroups: {},
    hcpPlanItems: {},
    openSupports: false,
    activeCategory: null,
    birthYear: 1990,
    postcode: 3000,
    planId: null,
    level: 1,
    PlanlevelItemGroup:{},
    activeItemNames:null,
    testlevel: [24.46,43.03,93.63,141.94],
    hcpRegistrationGroupId:null,
    hcpRegistrationGroups: [],
    dialogPage: PLAN_ITEM_GROUPS_VIEW,
    showMonthView: false,
    monthViewDate: setMonth(new Date(), 1),
    planItemDialogPage: -1,
    selectedPlanItem: null,
    flag: false,
  };

  async componentDidMount() {
    // call backend to load all plan groups and corresponding categories

    console.log("Dashboard147 尝试get supportGroup")
    api.Hcp_SupportGroups.all()
      .then((response) => {
        this.setState({ hcpSupportGroups: [...response.data] },
            this.loadState);
      })
      .catch((error) => {
        console.log(error);
      });
    console.log("Dashboard156 尝试get RegistrationGroup")
    api.Hcp_RegistrationGroups.list().then((response) => {
      this.setState({ hcpRegistrationGroups: response.data });
    });

  }

  componentDidUpdate(prevProps, prevState, snapShot) {
    if (
      this.props.currentUser == null &&
      this.state.hcpPlanCategories !== prevState.hcpPlanCategories
    ) {
      localStorage.setItem(
        PLAN_CATEGORIES,
        JSON.stringify(this.state.hcpPlanCategories)
      );
    }
  }

  // load plan categories, birthYear and postcode either from backend if logged in else from local storage
  loadState = async () => {
    let hcpPlanCategories = {};
    let planDates = {};
    let planName = null;
    let hcpPlanItemGroups = {};
    let hcpSupportItems = {};
    let flag = false;
    let items = [];
    let level = 1;
    let planitems=[];
    let PlanlevelItemGroup={};
    // TODO: update for hcpPlanItemGroups
    console.log("loading data")
    if (localStorage.getItem(LocalStorageKeys.ACCESS) != null) {
      console.log("Dashboard191 尝试load HcpPlans")
      await api.Hcp_Plans.list().then(async (response) => {
        if (response.data.length === 0) {
          window.location.href = "/hcp/budget/edit";
        } else {
          const plans = response.data;
          if (this.props.location.state === undefined) {
            // for (var i = 0; i < 1; i++) {
            var i = 0;
            this.state.planId = plans[i].id;
            for (var ind = 0; ind < plans.length; ind++) {
              planDates[plans[ind].id] = {
                startDate: plans[ind].startDate,
                endDate: plans[ind].endDate,
              };
            }
            planName = plans[i].name;
            localStorage.setItem("startDate", plans[i].startDate);
            localStorage.setItem("endDate", plans[i].endDate);

            console.log("Dashboard211 尝试load Hcp_PlanItemGroups")
            _.map(plans[i].hcpPlanCategories, async (hcpPlanCategory) => {
              api.Hcp_PlanItemGroups.list(hcpPlanCategory.plan, hcpPlanCategory.id).then(
                (responsePlanItemGroup) => {
                  let hcpPlanItemGroups = [];
                  // let indexPlanItemGroup = 0;
                  if (responsePlanItemGroup.data.length !== 0) {
                    hcpPlanItemGroups = responsePlanItemGroup.data.map(
                      (hcpPlanItemGroup, index) => {
                        if (hcpPlanCategory.id === hcpPlanItemGroup.hcpPlanCategory) {
                            console.log("Dashboard221 尝试load Hcp_PlanItems PlanCateid:"+hcpPlanCategory.id )
                          api.Hcp_PlanItems.list(
                            hcpPlanCategory.plan,
                            hcpPlanCategory.id,
                            hcpPlanItemGroup.id
                          ).then((responsePlanItem) => {
                            let hcpPlanItems = [];
                            // let indexPlanItem = 0;
                            if (responsePlanItem.data.length !== 0) {
                              hcpPlanItems = responsePlanItem.data.map(
                                (hcpPlanItem, index) => {
                                  if (
                                    hcpPlanItemGroup.id === hcpPlanItem.hcpPlanItemGroup
                                  ) {
                                    hcpPlanItems[index] = {
                                      ...hcpPlanItem,
                                    };
                                    // index2++;
                                    return {
                                      ...hcpPlanItem,
                                    };
                                  }
                                  return {};
                                }
                              );
                              hcpPlanItemGroups[index] = {
                                ...hcpPlanItemGroup,
                                hcpPlanItems: hcpPlanItems || [],
                              };
                              // index++;
                            }
                          });
                          return {
                            ...hcpPlanItemGroup,
                          };
                        }
                        return {};
                      }
                    );
                    // if (plans[i].id === hcpPlanCategory.plan) {
                    hcpPlanCategories[hcpPlanCategory.hcpSupportCategory] = {
                      ...hcpPlanCategory,
                      hcpPlanItemGroups: hcpPlanItemGroups || [],
                    };
                    // }
                  }
                }
              );
              hcpPlanCategories[hcpPlanCategory.hcpSupportCategory] = {
                ...hcpPlanCategory,
                hcpPlanItemGroups: [],
              };
            });
            // }
          } else {
            await Promise.all(
              _.map(plans, async (plan) => {
                this.state.planId = plan.id;
                planDates[plan.id] = {
                  startDate: plan.startDate,
                  endDate: plan.endDate,
                };
                // find corresponding plan
                if (this.props.location.state === plan.id) {
                  planName = plan.name;
                  // for each planCategory
                  _.map(plan.hcpPlanCategories, async (hcpPlanCategory) => {
                    console.log("Dashboard287 尝试load PlanItemGroups else PlanCategoryid："+hcpPlanCategory.id)
                    api.Hcp_PlanItemGroups.list(
                      hcpPlanCategory.plan,
                      hcpPlanCategory.id
                    ).then((responsePlanItemGroup) => {
                      let hcpPlanItemGroups = [];
                      // let indexPlanItemGroup = 0;
                      console.log(responsePlanItemGroup.data);
                      //
                      if (responsePlanItemGroup.data.length !== 0) {
                        hcpPlanItemGroups = responsePlanItemGroup.data.map(
                          (hcpPlanItemGroup, index) => {
                            if (
                              hcpPlanCategory.id === hcpPlanItemGroup.hcpPlanCategory
                            ) {
                            console.log("Dashboard302 尝试load PlanItems else PC_id:"+hcpPlanCategory.id )
                              api.Hcp_PlanItems.list(
                                hcpPlanCategory.plan,
                                hcpPlanCategory.id,
                                hcpPlanItemGroup.id
                              ).then((responsePlanItem) => {
                                let hcpPlanItems = [];
                                // let indexPlanItem = 0;
                                if (responsePlanItem.data.length !== 0) {
                                  hcpPlanItems = responsePlanItem.data.map(
                                    (hcpPlanItem, index) => {
                                      if (
                                        hcpPlanItemGroup.id ===
                                        hcpPlanItem.planItemGroup
                                      ) {
                                        hcpPlanItems[index] = {
                                          ...hcpPlanItem,
                                        };
                                        // index2++;
                                        return {
                                          ...hcpPlanItem,
                                        };
                                      }
                                      return {};
                                    }
                                  );
                                  console.log(hcpPlanItems)
                                  hcpPlanItemGroups[index] = {
                                    ...hcpPlanItemGroup,
                                    hcpPlanItems: hcpPlanItems || [],
                                  };
                                  // index++;
                                }
                              });
                              return {
                                ...hcpPlanItemGroup,
                              };
                            }
                            return {};
                          }
                        );
                        if (plan.id === hcpPlanCategory.plan) {
                          hcpPlanCategories[hcpPlanCategory.hcpSupportCategory] = {
                            ...hcpPlanCategory,
                            hcpPlanItemGroups: hcpPlanItemGroups || [],
                          };
                        }
                      }
                    });
                    hcpPlanCategories[hcpPlanCategory.hcpSupportCategory] = {
                      ...hcpPlanCategory,
                      hcpPlanItemGroups: [],
                    };
                  });
                }
              })
            );
          }
        }
      });
      flag = true;
         _.forEach(this.state.hcpSupportGroups, (hcpSupportGroup) => {
          _.forEach(hcpSupportGroup.hcpSupportCategories, (hcpSupportCategory) => {
            console.log("Dashboard  Ln 398 尝试Load SupportItem SupportCate:"+hcpSupportCategory.id)
          api.Hcp_SupportItems.get({hcpsupportCategoryID:hcpSupportCategory.id}).
            then((response) => {
              if(hcpSupportCategory.id>2 && hcpSupportCategory.id!=11){
                  hcpSupportItems[hcpSupportCategory.id] = response.data;}
            });
          });
        });
          if(hcpPlanCategories[11].hcpPlanItemGroups.length>0 &&
              hcpPlanCategories[11].hcpPlanItemGroups[0].hcpPlanItems.length>0){
              level = parseInt(planitems[0].priceActual)
          }
      this.setState({
        planDates,
        planName,
        hcpPlanCategories,
        hcpSupportItems,
//        birthYear,
//        postcode,
        flag,
          level,
      });
    } else {
      let cachedhcpPlanCategories = localStorage.getItem(PLAN_CATEGORIES);
      const cachedName = localStorage.getItem("name");
      const cachedStartDate = localStorage.getItem("startDate");
      const cachedEndDate = localStorage.getItem("endDate");
      if (
        cachedStartDate != null &&
        cachedEndDate != null &&
        cachedhcpPlanCategories != null
      ) {
        hcpPlanCategories = JSON.parse(cachedhcpPlanCategories);
        planDates[0] = {
          startDate: dateToString(cachedStartDate),
          endDate: dateToString(cachedEndDate),
        };
        planName = cachedName;
        flag = true;
          if(hcpPlanCategories[11].hcpPlanItemGroups.length>0 &&
              hcpPlanCategories[11].hcpPlanItemGroups[0].hcpPlanItems.length>0){
              level = parseInt(hcpPlanCategories[11].hcpPlanItemGroups[0].hcpPlanItems[0].priceActual)
          }
         _.forEach(this.state.hcpSupportGroups, (hcpSupportGroup) => {
          _.forEach(hcpSupportGroup.hcpSupportCategories, (hcpSupportCategory) => {
            console.log("Dashboard  Ln 398 尝试Load SupportItem SupportCate:"+hcpSupportCategory.id)
          api.Hcp_SupportItems.get({hcpsupportCategoryID:hcpSupportCategory.id}).
            then((response) => {
              if(hcpSupportCategory.id>2 && hcpSupportCategory.id!=11){
                  hcpSupportItems[hcpSupportCategory.id] = response.data;}
            });
          });
        });

        this.setState({
          hcpPlanCategories,
          hcpSupportItems,
          planDates,
          planName,
          flag,
            level,
        });
      } else {
        this.props.history.push("/hcp/budget/edit");
      }
    }
    this.updateState();
  };

  updateState() {
    setInterval(() => {
      this.setState({ hcpPlanCategories: this.state.hcpPlanCategories });
    }, 2000);
  }

  findhcpSupportCategory = () => {
    let result = null;
    _.forEach(this.state.hcpSupportGroups, (hcpSupportGroup) => {
      _.forEach(hcpSupportGroup.hcpSupportCategories, (hcpSupportCategory) => {
        if (hcpSupportCategory.id === this.state.activeCategory) {
          result = hcpSupportCategory;
        }
      });
    });
    return result;
  };

  handleOpenSupports = (supportCategoryId) => {
    this.setState(
      { activeCategory: supportCategoryId, dialogPage: PLAN_ITEM_GROUPS_VIEW },
      () => {
        this.setState({ openSupports: true });
      }
    );
  };

  handleCloseSupports = () => {
    this.setState({ openSupports: false });
  };

  handleEditPlanItemGroups = (hcpPlanCategoryid, hcpPlanItemGroups) => {
    console.log("Try edit plan Item Groups")
    console.log({
            ...this.state.hcpPlanCategories[hcpPlanCategoryid],
            hcpPlanItemGroups: hcpPlanItemGroups,
          })
    this.setState(
      {
        hcpPlanCategories: {
          ...this.state.hcpPlanCategories,
          [hcpPlanCategoryid]: {
            ...this.state.hcpPlanCategories[hcpPlanCategoryid],
            hcpPlanItemGroups: hcpPlanItemGroups,
          },
        },
      },
      () => {
        this.setState({ selectedPlanItem: null, planItemDialogPage: -1 });
      }
    );
    if (hcpPlanItemGroups.length !== 0 || hcpPlanItemGroups.length !== undefined) {
      console.log("hcpPlanItemGroups");
      console.log(hcpPlanItemGroups);
      for (let i = 0; i < hcpPlanItemGroups.length; i++) {
        if (
          hcpPlanItemGroups[i].hcpPlanCategory !== undefined &&
          hcpPlanItemGroups[i].id !== undefined
        ) {
          let planId = 0;
          let planCategoryId = hcpPlanItemGroups[i].hcpPlanCategory;
          let planItemGroupId = hcpPlanItemGroups[i].id;

          if (hcpPlanItemGroups[i].hcpPlanItems &&(
            hcpPlanItemGroups[i].hcpPlanItems.length !== 0 ||
            hcpPlanItemGroups[i].hcpPlanItems.length !== undefined)
          ) {
            for (let j = 0; j < hcpPlanItemGroups[i].hcpPlanItems.length; j++) {
              let planItemId = hcpPlanItemGroups[i].hcpPlanItems[j].id;
              const planItemData = {
                name: hcpPlanItemGroups[i].hcpPlanItems[j].name,
                priceActual: hcpPlanItemGroups[i].hcpPlanItems[j].priceActual,
                startDate: dateToString(
                  hcpPlanItemGroups[i].hcpPlanItems[j].startDate
                ),
                endDate: dateToString(hcpPlanItemGroups[i].hcpPlanItems[j].endDate),
                allDay: hcpPlanItemGroups[i].hcpPlanItems[j].allDay,
              };
                console.log("Dashboard 510 尝试Update PlanItem")
                console.log(planItemData)
              api.Hcp_PlanItems.update(
                planId,
                planCategoryId,
                planItemGroupId,
                planItemId,
                planItemData
              ).then((response) => {
                // onEditPlanItemGroups([hcpPlanItemGroup, ...hcpPlanItemGroups]);
              });
            }
          }
          // });
        }
      }
    }
  };

  handleDeletePlanItem = () => {
    const hcpPlanItem = this.state.selectedPlanItem;
    let editedPlanItemGroups;
    let hcpSupportCategory;
    for (const [key, value] of Object.entries(this.state.hcpPlanCategories)) {
      for (let i = 0; i < value.hcpPlanItemGroups.length; i++) {
        if (value.hcpPlanItemGroups[i].hcpPlanItems.includes(hcpPlanItem)) {
          const hcpPlanItemGroup = value.hcpPlanItemGroups[i];

          const editedPlanItemGroup = {
            ...hcpPlanItemGroup,
            hcpPlanItems: _.difference(hcpPlanItemGroup.hcpPlanItems, [hcpPlanItem]),
          };
          editedPlanItemGroups = _.difference(value.hcpPlanItemGroups, [
            hcpPlanItemGroup,
          ]);
          editedPlanItemGroups.push(editedPlanItemGroup);
          hcpSupportCategory = key;

          break;
        }
      }
      if (hcpSupportCategory != null) {
        break;
      }
    }

    this.handleEditPlanItemGroups(hcpSupportCategory, editedPlanItemGroups);
  };

  handleEditPlanItem = (editedPlanItem) => {
    const hcpPlanItem = this.state.selectedPlanItem;
    let editedPlanItemGroups;
    let hcpSupportCategory;
    for (const [key, value] of Object.entries(this.state.hcpPlanCategories)) {
      for (let i = 0; i < value.hcpPlanItemGroups.length; i++) {
        if (value.hcpPlanItemGroups[i].hcpPlanItems.includes(hcpPlanItem)) {
          const hcpPlanItemGroup = value.hcpPlanItemGroups[i];

          const editedPlanItemGroup = {
            ...hcpPlanItemGroup,
            hcpPlanItems: hcpPlanItemGroup.hcpPlanItems.map((pI) => {
              if (pI === hcpPlanItem) {
                return editedPlanItem;
              } else {
                return pI;
              }
            }),
          };
          editedPlanItemGroups = _.difference(value.hcpPlanItemGroups, [
            hcpPlanItemGroup,
          ]);
          editedPlanItemGroups.push(editedPlanItemGroup);
          hcpSupportCategory = key;

          break;
        }
      }
      if (hcpSupportCategory != null) {
        break;
      }
    }

    this.handleEditPlanItemGroups(hcpSupportCategory, editedPlanItemGroups);
  };

  handleSetMonthView = (date) => {
    this.setState({ monthViewDate: date }, () =>
      this.setState({ showMonthView: true })
    );
  };

  handleCloseDialog = () => {
    this.setState({ planItemDialogPage: -1 });
  };

  handleSelectEvent = (info) => {
    this.setState({
      selectedPlanItem: info.event.extendedProps.hcpPlanItem,
      planItemDialogPage: PLAN_ITEM_DIALOG_PAGES.preview,
    });
  };

  handleClickDelete = () => {
    this.setState({ planItemDialogPage: PLAN_ITEM_DIALOG_PAGES.delete });
  };

  handleClickEdit = () => {
    this.setState({ planItemDialogPage: PLAN_ITEM_DIALOG_PAGES.edit });
  };

  calculateCoreAllocated = () => {
    let allocated = 0;
    let core = this.state.hcpSupportGroups.find((obj) => {
      return obj.name === "Core";
    });
    _.forEach(core.supportCategories, (hcpSupportCategory) => {
      const hcpPlanCategory = this.state.hcpPlanCategories[hcpSupportCategory.id];
      allocated += calculateAllocated(hcpPlanCategory.hcpPlanItemGroups);
    });
    return allocated.toFixed(2);
  };

  renderSummary = () => {
    let total = 0;
    let allocated = 0;
    let events = [];
    let budgets=[];
    let categories=[];
    Object.values(this.state.hcpPlanCategories).forEach((hcpPlanCategories) => {
      hcpPlanCategories.hcpPlanItemGroups.forEach((hcpPlanItemGroup) => {
        events = events.concat(planItemGroupToEvents(hcpPlanItemGroup));
      });
    });
    let dayindex =(this.state.planId?this.state.planId:0)
    let days = differenceInMinutes(
              new Date(this.state.planDates[dayindex].endDate),
              new Date(this.state.planDates[dayindex].startDate)
            )/60/24+1
    total=this.state.testlevel[this.state.level-1]*days;
    _.map(this.state.hcpPlanCategories, (hcpPlanCategory) => {
      // if (hcpPlanCategory.budget !== 0) {
        // total += parseFloat(hcpPlanCategory.budget);
        // if(hcpPlanCategory.)
      if(hcpPlanCategory.hcpSupportCategory== 12){
        total += calculateAllocated(hcpPlanCategory.hcpPlanItemGroups);
      }else if(hcpPlanCategory.hcpSupportCategory <11){
        let money = calculateAllocated(hcpPlanCategory.hcpPlanItemGroups);
        if(money>0){
          budgets.push(money);
          categories.push(hcpPlanCategory.name);
          allocated += money;
        }
      }
      // }
    });
    return (
      <div>
        {this.state.selectedPlanItem != null &&
          ((this.state.planItemDialogPage ===
            PLAN_ITEM_DIALOG_PAGES.preview && (
            <PlanItemCalendarDialog
              open={
                this.state.planItemDialogPage ===
                  PLAN_ITEM_DIALOG_PAGES.preview &&
                this.state.selectedPlanItem != null
              }
              hcpPlanItem={this.state.selectedPlanItem}
              onClose={this.handleCloseDialog}
              onDelete={this.handleClickDelete}
              onEdit={this.handleClickEdit}
            />
          )) ||
            (this.state.planItemDialogPage ===
              PLAN_ITEM_DIALOG_PAGES.delete && (
              <PlanItemDeleteDialog
                open={
                  this.state.planItemDialogPage ===
                    PLAN_ITEM_DIALOG_PAGES.delete &&
                  this.state.selectedPlanItem != null
                }
                onClose={this.handleCloseDialog}
                onDelete={this.handleDeletePlanItem}
              />
            )) ||
            (this.state.planItemDialogPage === PLAN_ITEM_DIALOG_PAGES.edit && (
              <Dialog
                open={
                  this.state.planItemDialogPage ===
                    PLAN_ITEM_DIALOG_PAGES.edit &&
                  this.state.selectedPlanItem != null
                }
              >
                <PlanItemEditView
                  hcpPlanItem={this.state.selectedPlanItem}
                  onSave={this.handleEditPlanItem}
                />
              </Dialog>
            )))}
        {this.state.showMonthView === true && (
          <Dialog
            open={this.state.showMonthView === true}
            onClose={() => this.setState({ showMonthView: false })}
          >
            <DialogTitle classes={{ root: styles.dialogTitle }}>
              <IconButton
                aria-label="close"
                className={styles.closeButton}
                onClick={() => this.setState({ showMonthView: false })}
              >
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent>
              <FullCalendar
                plugins={[dayGridPlugin]}
                defaultDate={this.state.monthViewDate}
                fixedWeekCount={false}
                height="parent"
                events={this.events()}
                eventClick={this.handleSelectEvent}
              />
            </DialogContent>
          </Dialog>
        )}

        <Card>
          <CardHeader title={this.state.planName + ": Budget Summary     Total Funding: $"+ total } />
          <CardContent>
            <Grid container justify="center" >
                  <Grid xs={7} >
                    <DoughnutBody allocated={allocated} categories={categories} budgets={budgets} total={total} />
                  </Grid>
              {/*<Grid >*/}
              {/*  {total === 0 ? (*/}
              {/*    <div>*/}
              {/*      No budgets allocated to any category! Please edit your plan.*/}
              {/*    </div>*/}
              {/*  ) : (*/}
              {/*    <Grid >*/}
              {/*      <DoughnutBody allocated={allocated} categories={categories} budgets={budgets} total={total} />*/}
              {/*    </Grid>*/}
              {/*  )}*/}
              {/*</Grid>*/}
            </Grid>
          </CardContent>
          <CardActions disableSpacing>
            <Grid container justify="flex-end">
              <Grid item>
                <Button
                  onClick={() => (window.location.href = "/hcp/budget/edit")}
                  size="small"
                >
                  <EditIcon />
                  Edit Plan
                </Button>

              </Grid>
            </Grid>
          </CardActions>
        </Card>
      </div>
    );
  };

  renderhcpPlanCategories = () => {
    return _.map(this.state.hcpSupportGroups, (hcpSupportGroup) => {
        return (
          <ExpansionPanel defaultExpanded>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon color="secondary" />}>
              <Typography variant="h5">{hcpSupportGroup.name}</Typography>
            </ExpansionPanelSummary>
          <ExpansionPanelDetails>
          <Grid container direction="column" justify="space-around"alignItems="stretch">
            {_.map(hcpSupportGroup.hcpSupportCategories, (hcpSupportCategory) => {
              const hcpPlanCategory = this.state.hcpPlanCategories[
                hcpSupportCategory.id
              ];
              if (hcpSupportCategory.id ==11 ){
                  return (
                        <ExpansionPanel defaultExpanded>
                          <ExpansionPanelSummary
                          expandIcon={<ExpandMoreIcon color="secondary" />}
                        >
                            <Typography variant="h5">{hcpSupportCategory.name}</Typography>
                          </ExpansionPanelSummary>
                          <ExpansionPanelDetails>
                              <Grid >
                                <Grid item>
                                  <label >
                                    <input type="radio" name='level' value="1" defaultChecked={this.state.level===1} onChange={this.handleLevelChange}/>
                                           Level 1
                                  </label><br/>
                                  <label >
                                    <input type="radio" name='level' value="2" defaultChecked={this.state.level===2} onChange={this.handleLevelChange}/>
                                           Level 2
                                  </label><br/>
                                  <label >
                                    <input type="radio" name='level' value="3" defaultChecked={this.state.level===3} onChange={this.handleLevelChange}/>
                                           Level 3
                                  </label><br/>
                                  <label >
                                    <input type="radio" name='level' value="4" defaultChecked={this.state.level===4} onChange={this.handleLevelChange}/>
                                           Level 4
                                  </label>
                                </Grid>
                              </Grid>
                          </ExpansionPanelDetails>
                        </ExpansionPanel>
                      );
              }
              else {
                  return (
                        <HcpBudgetCategoryCard
                            {...{
                              supportcategory: hcpSupportCategory,
                              plancategory:hcpPlanCategory,
                              total: parseFloat(hcpPlanCategory.budget),
                              allocated: calculateAllocated(
                                  hcpPlanCategory.hcpPlanItemGroups
                              ),
                              totalColor: LIGHT_BLUE,
                              allocatedColor: DARK_BLUE,
                              supportitems: this.state.hcpSupportItems,
                              hcpRegistrationGroup:null,
                            }}
                            openSupports={() =>
                                this.handleOpenSupports(hcpSupportCategory.id)
                            }
                            saveCategoryName={this.handleCategoryNameSave}
                            saveItemGroupName={this.handleItemGroupNameSave}
                            handleadd = {this.handleAdd}
                            handleManagement = {this.handleManagement}
                        />
                  );
              }
            })}
            </Grid>
        </ExpansionPanelDetails>
          </ExpansionPanel>
          // {/*</BudgetCategorySection>*/}
        );
      // }
    });
  };

  handleCategoryNameSave = (id,name)=>{
      let hcpPlanCategories = this.state.hcpPlanCategories;
    let plancategoryid = hcpPlanCategories[id].id;

    if (localStorage.getItem(LocalStorageKeys.ACCESS) != null) {
      api.Hcp_PlanCategory.update(this.state.planId,plancategoryid,name)
                .then((response) => {
                  // onEditPlanItemGroups([hcpPlanItemGroup, ...hcpPlanItemGroups]);
                });
    }

      this.setState({
        hcpPlanCategories: {
          ...hcpPlanCategories,
          [id]: {
            ...hcpPlanCategories[id],
            name: name,
          },
        },
      });

  }

  handleItemGroupNameSave = (categoryid,itemgroupid,name)=>{
    console.log("Cid "+ categoryid + " IID"+itemgroupid+" Name:"+name);
    let hcpPlanCategories = this.state.hcpPlanCategories;
    let hcpPlanItemGroups= hcpPlanCategories[categoryid].hcpPlanItemGroups;
    let created=false;
    for (let i=0; i < hcpPlanItemGroups.length; i++){
      if(hcpPlanItemGroups[i].hcpSupportItemGroup==itemgroupid){
         hcpPlanItemGroups[i].name=name
           created=true;
           api.Hcp_PlanItemGroups.update(this.state.planId, hcpPlanCategories[categoryid].id, hcpPlanItemGroups[i].id,{name}).then(
              (response) => {
                console.log("update plan item group name")
              });
           }
     }
     if(!created) {
       hcpPlanItemGroups.push({hcpSupportItemGroup: itemgroupid, name: name, hcpPlanItems: []});

        const hcpPlanItemGroupData = {
            hcpPlanCategory: categoryid,
            hcpSupportItemGroup: itemgroupid,
            name: name,
            nickname: name,
          };
           api.Hcp_PlanItemGroups.create(this.state.planId, hcpPlanCategories[categoryid].id, hcpPlanItemGroupData).then(
              (response) => {
                console.log("create a PIG to store name")
              });
     }
    let hcpPlanCategpry=hcpPlanCategories[categoryid];


       this.setState({
         hcpPlanCategories: {
           ...hcpPlanCategories,
           [categoryid]: {
             ...hcpPlanCategpry,
             hcpPlanItemGroups:hcpPlanItemGroups
           },
           // hcpPlanItemGroups:[],
         },
       });


  }

  handleLevelChange = (e) =>  {
      let levelCategory = this.state.hcpPlanCategories['11'];


      const planItemData = {
                        startDate:localStorage.getItem("startDate"),
                        endDate:localStorage.getItem("endDate"),
                        priceActual: e.target.value,
                        name: "Package Level",
                        allDay: true
              };

      let hcpPlanItemGroups = [{
                    hcpSupportItemGroup: parseInt(e.target.value)+42,
                    hcpPlanItems:[planItemData],
                    name:"Package level",
                    nickname:"Package level"
                }];

      this.setState({
          hcpPlanCategories:{
              ...this.state.hcpPlanCategories,
              ['11']:{
                  ...levelCategory,
                  hcpPlanItemGroups: hcpPlanItemGroups,
              }
          },
          level:e.target.value,
      });

  }

  handleAdd = (id,itemgroups) =>  {
    if(itemgroups.length==0){
      return;
    }
    console.log('handle add');
    let itemnames= {};
     let planitemgroups = this.state.hcpPlanCategories[id]['hcpPlanItemGroups']
    for(let i=0; i<itemgroups.length;i++){
      for(let j=0;j<planitemgroups.length;j++){
        if(planitemgroups[j].hcpSupportItemGroup==itemgroups[i].hcpSupportItemGroup){
          itemnames[i]=planitemgroups[j].name;
          break;
        }
      }
    }
    this.setState(
      {
        activeCategory: id,
        activeItems: itemgroups,
        activeItemNames:itemnames,
        dialogPage:SUPPORT_ITEMS_VIEW,
      },
      () => {
        this.setState({ openSupports: true });
      }
    );
  }

  handleManagement = (id) =>  {
    console.log('handle management');
    this.setState(
      {
        activeCategory: id,
        dialogPage: MANAGEMENT_EDIT,
      },
      () => {
        this.setState({ openSupports: true });
      }
    );
  }


  events = () => {
    const events = [];
    for (const hcpPlanCategory of Object.values(this.state.hcpPlanCategories)) {
      hcpPlanCategory.hcpPlanItemGroups.forEach((hcpPlanItemGroup) => {
        const toAdd = planItemGroupToEvents(hcpPlanItemGroup);
        events.push(...toAdd);
      });
    }

    return events;
  };

  render() {
    const {
      planDates,
      hcpSupportItems,
      hcpPlanCategories,
      oldPlanCategories,
      hcpSupportGroups,
      hcpPlanItemGroups,
      hcpRegistrationGroups,
      birthYear,
      postcode,
      hcpPlanItems ,
      flag,
    } = this.state;
    return (
      <div className="root">
        {flag ? (
          <Grid container justify="center">
            <Grid container justify="center">
              {this.state.hcpPlanCategories !== {} && (
                <Grid item xs={12} md={11} xl={10}>
                  {console.log("hcpPlanCategories")}
                  {console.log(this.state.hcpPlanCategories)}
                  {/*{console.log("Support Items")}*/}
                  {/*{console.log(this.state.hcpSupportItems)}*/}

                  {this.renderSummary()}
                  {/*{this.renderLevel()}*/}
                  {Object.keys(hcpPlanCategories).length !== 0 &&
                    this.renderhcpPlanCategories()}

                  <TwelveMonthCalendar
                    hcpSupportGroups={hcpSupportGroups}
                    hcpPlanCategories={hcpPlanCategories}
                    planDates={planDates}
                    onClick={this.handleSetMonthView}
                  />
                </Grid>
              )}
            </Grid>
            {this.state.openSupports && (
              <SupportItemDialog
                  editedItems = {this.state.activeItems}
                  itemNames={this.state.activeItemNames}
                  open={this.state.openSupports}
                  hcpSupportCategory={this.findhcpSupportCategory()}
                  onClose={this.handleCloseSupports}
                  hcpPlanCategory={
                    this.state.hcpPlanCategories[this.state.activeCategory]
                  }
                  activeCategory ={this.state.activeCategory}
                  onEditHcpPlanItemGroups={this.handleEditPlanItemGroups}
                  openAddSupports={this.state.openAddSupports}
                  registrationGroups={this.state.registrationGroups}
                  page={this.state.dialogPage}
                  setPage={(page) => this.setState({ dialogPage: page })}
              />
            )}
          </Grid>
        ) : (
          <></>
        )}
      </div>
    );
  }
}

export default connect(mapStateToProps)(hcp_BudgetDashboard);
