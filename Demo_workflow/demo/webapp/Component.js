sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ui/Device",
    "wf/demo/model/models"
], (UIComponent,Device, models) => {
    "use strict";

    return UIComponent.extend("wf.demo.Component",  {
            metadata: {
            manifest: "json",
            },
            // init: function () {
            // // call the base component's init function
            // UIComponent.prototype.init.apply(this, arguments);

            // // enable routing
            // this.getRouter().initialize();

            // // set the device model
            // this.setModel(models.createDeviceModel(), "device");

            // this.setTaskModels();

            // const rejectOutcomeId = "reject";
            // this.getInboxAPI().addAction(
            //     {
            //     action: rejectOutcomeId,
            //     label: "Reject",
            //     type: "reject",
            //     },
            //     function () {
            //     this.completeTask(false, rejectOutcomeId);
            //     },
            //     this
            // );
            // const approveOutcomeId = "approve";
            // this.getInboxAPI().addAction(
            //     {
            //     action: approveOutcomeId,
            //     label: "Approve",
            //     type: "accept",
            //     },
            //     function () {
            //     this.completeTask(true, approveOutcomeId);
            //     },
            //     this
            // );
            // },

            // setTaskModels: function () {
            // // set the task model
            // var startupParameters = this.getComponentData().startupParameters;
            // this.setModel(startupParameters.taskModel, "task");

            // // set the task context model
            // var taskContextModel = new sap.ui.model.json.JSONModel(
            //     this._getTaskInstancesBaseURL() + "/context"
            // );
            // this.setModel(taskContextModel, "context");
            // },

            init: function () {
    UIComponent.prototype.init.apply(this, arguments);

    this.getRouter().initialize();
    this.setModel(models.createDeviceModel(), "device");

    // only call when running inside My Inbox / Workflow environment
    const compData = this.getComponentData();
    if (compData && compData.startupParameters) {
        this.setTaskModels();

        const inboxAPI = compData.startupParameters.inboxAPI;
        if (inboxAPI) {
            const rejectOutcomeId = "reject";
            inboxAPI.addAction(
                {
                    action: rejectOutcomeId,
                    label: "Reject",
                    type: "reject"
                },
                function () {
                    this.completeTask(false, rejectOutcomeId);
                },
                this
            );

            const approveOutcomeId = "approve";
            inboxAPI.addAction(
                {
                    action: approveOutcomeId,
                    label: "Approve",
                    type: "accept"
                },
                function () {
                    this.completeTask(true, approveOutcomeId);
                },
                this
            );
        }
    } else {
        console.warn("⚠️ Running standalone — no workflow context found.");
    }
},
        setTaskModels: function () {
            var startupParameters = this.getComponentData()?.startupParameters || {
                taskModel: new sap.ui.model.json.JSONModel({ InstanceID: "TEST123" }),
                inboxAPI: {
                    addAction: function (a, b, c) {
                        console.log("Mock addAction:", a);
                    },
                    updateTask: function () {
                        console.log("Mock updateTask called");
                    }
                }
            };
            this.setModel(startupParameters.taskModel, "task");

            var taskContextModel = new sap.ui.model.json.JSONModel({
                approved: null,
                comment: ""
            });
            this.setModel(taskContextModel, "context");
        },


            _getTaskInstancesBaseURL: function () {
            return (
                this._getWorkflowRuntimeBaseURL() +
                "/task-instances/" +
                this.getTaskInstanceID()
            );
            },

            _getWorkflowRuntimeBaseURL: function () {  
              var ui5CloudService = this.getManifestEntry("/sap.cloud/service").replaceAll(".", "");  
              var ui5ApplicationName = this.getManifestEntry("/sap.app/id").replaceAll(".", "");  
              var appPath = `${ui5CloudService}.${ui5ApplicationName}`;
              return `/${appPath}/api/public/workflow/rest/v1`

            },

            getTaskInstanceID: function () {
            return this.getModel("task").getData().InstanceID;
            },

            getInboxAPI: function () {
            var startupParameters = this.getComponentData().startupParameters;
            return startupParameters.inboxAPI;
            },

            completeTask: function (approvalStatus, outcomeId) {
            this.getModel("context").setProperty("/approved", approvalStatus);
            this._patchTaskInstance(outcomeId);
            },

            _patchTaskInstance: function (outcomeId) {
            const context = this.getModel("context").getData();
            var data = {
                status: "COMPLETED",
                context: {...context, comment: context.comment || ''},
                decision: outcomeId
            };

            jQuery.ajax({
                url: `${this._getTaskInstancesBaseURL()}`,
                method: "PATCH",
                contentType: "application/json",
                async: true,
                data: JSON.stringify(data),
                headers: {
                "X-CSRF-Token": this._fetchToken(),
                },
            }).done(() => {
                this._refreshTaskList();
            })
            },

            _fetchToken: function () {
            var fetchedToken;

            jQuery.ajax({
                url: this._getWorkflowRuntimeBaseURL() + "/xsrf-token",
                method: "GET",
                async: false,
                headers: {
                "X-CSRF-Token": "Fetch",
                },
                success(result, xhr, data) {
                fetchedToken = data.getResponseHeader("X-CSRF-Token");
                },
            });
            return fetchedToken;
            },

            _refreshTaskList: function () {
            this.getInboxAPI().updateTask("NA", this.getTaskInstanceID());
            },
        }
        );
    });