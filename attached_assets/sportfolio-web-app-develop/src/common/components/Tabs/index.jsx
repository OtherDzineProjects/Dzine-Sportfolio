import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import "./styles.css";
import { Link } from "react-router-dom";
import { Button } from "common";

const DynamicTabs = ({
  data,
  handleChange = () => {},
  selectedIndex = 0,
  showButton = false,
  buttonText = "Create New",
  onButtonClick = () => {}
}) => {
  return (
    <Tabs align="start" index={selectedIndex}>
      <TabList>
        {data.map((item, index) => (
          <Tab
            key={index}
            onClick={() => handleChange(item.key)}
            as={Link}
            to={item.url}
          >
            <div
              className={`flex items-center gap-4 ${
                selectedIndex === index ? "active-tab" : "inactive-tab"
              }`}
            >
              {item.icon}
              {item.title}
              {item.count >= 0 && (
                <div
                  className={`count-container ${
                    selectedIndex === index ? "active" : "inactive"
                  }`}
                >
                  {item.count}
                </div>
              )}
            </div>
          </Tab>
        ))}
        {showButton && buttonText && (
          <Button
            className="ms-auto my-auto"
            size="sm"
            colorScheme="secondary"
            onClick={onButtonClick}
          >
            {buttonText}
          </Button>
        )}
      </TabList>
      <TabPanels>
        {data.map((item, index) => (
          <TabPanel key={index}>
            <div>{item.content}</div>
          </TabPanel>
        ))}
      </TabPanels>
    </Tabs>
  );
};

export default DynamicTabs;
