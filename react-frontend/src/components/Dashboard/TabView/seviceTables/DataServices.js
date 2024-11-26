import React, { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ProgressSpinner } from "primereact/progressspinner";
import client from "../../../../services/restClient";
import { TabView, TabPanel } from "primereact/tabview";

const DataServices = (props) => {
  const [dynaLoaderData, setDynaLoaderData] = useState([]); 
  const [documentStorageData, setDocumentStorageData] = useState([]); 
  const [templateData, setTemplateData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0); 

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (activeIndex === 0) {
          // Fetch DynaLoader data 
          const res = await client
            .service("dynaLoader")
            .find({ query: { $limit: 5 } });
          setDynaLoaderData(res.data);
        } else if (activeIndex === 1) {
          // Fetch Document Storage data 
          const res = await client
            .service("documentStorages")
            .find({ query: { $limit: 5 } });
          setDocumentStorageData(res.data);
        } else if (activeIndex === 2) {
          // Fetch Template data 
          const res = await client
            .service("templates")
            .find({ query: { $limit: 5 } });
          setTemplateData(res.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        props.alert({
          title: "Error",
          type: "error",
          message: error.message || "Failed to fetch data",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeIndex, props]);

  const dropdownTemplate0 = (rowData, { rowIndex }) => (
    <p>{rowData.dynaLoaderId?.name}</p> 
  );

  return (
    <TabView
      activeIndex={activeIndex}
      onTabChange={(e) => setActiveIndex(e.index)}
    >
      <TabPanel header="DynaLoader">
        <div className="dyna-loader-table"> 
          {loading ? (
            <ProgressSpinner />
          ) : (
            <DataTable value={dynaLoaderData} rows={5}>
              <Column field="from" header="From" sortable />
              <Column field="to2" header="To2" sortable />
              <Column
                field="name"
                header="Name"
                sortable
              />
            </DataTable>
          )}
        </div>
      </TabPanel>

      <TabPanel header="Documents">
        <div className="document-storage-table"> 
          {loading ? (
            <ProgressSpinner />
          ) : (
            <DataTable value={documentStorageData} rows={5}>
              <Column field="name" header="Name" sortable />
              <Column field="size" header="Size" sortable />
              <Column field="path" header="Path" sortable />
            </DataTable>
          )}
        </div>
      </TabPanel>

      <TabPanel header="Email Templates">
        <div className="template-table"> 
          {loading ? (
            <ProgressSpinner />
          ) : (
            <DataTable value={templateData} rows={5}>
              <Column field="name" header="Name" sortable />
              <Column field="subject" header="Subject" sortable />
              <Column field="body" header="Body" sortable />
            </DataTable>
          )}
        </div>
      </TabPanel>
    </TabView>
  );
};

export default DataServices;
