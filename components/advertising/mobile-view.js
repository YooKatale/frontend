import {
  Box,
  Card,
  Text,
  Tabs,
  Tab,
  TabList,
  TabPanels,
  TabPanel,
} from "@chakra-ui/react";
import { SmallCloseIcon, CheckIcon } from "@chakra-ui/icons";

function MobileView() {
  return (
    <Box className="md:hidden py-3 px-4">
      <Tabs variant="soft-rounded" colorScheme="yellow">
        <TabList>
          <Tab className="py-2.5 px-10 font-bold me-2 mb-2 text-xl text-gray-900 focus:outline-none bg-white rounded-full border border-gray-200 hover:bg-gray-100 hover:text-blue-700  dark:border-gray-600">
            Basic
          </Tab>
          <Tab className="py-2.5 px-10 font-bold me-2 mb-2 text-xl text-gray-900 focus:outline-none bg-white rounded-full border border-gray-200 hover:bg-gray-100 hover:text-blue-700  dark:border-gray-600">
            VIP
          </Tab>
        </TabList>
        <TabPanels>
          <TabPanel className="-ml-7 -mr-7">
            <Card>
              <Tabs variant="unstyled">
                <TabList className="overflow-x-auto">
                  <Tab
                    _selected={{ border: "1px", borderColor: "green" }}
                    className="flex flex-col"
                  >
                    Weekly
                    <span className="text-sm">32,000 ugx</span>
                  </Tab>
                  <Tab
                    _selected={{ border: "1px", borderColor: "green" }}
                    className="flex flex-col"
                  >
                    Monthly
                    <span className="text-sm">92,000 ugx</span>
                  </Tab>
                  <Tab
                    _selected={{ border: "1px", borderColor: "green" }}
                    className="flex flex-col"
                  >
                    3 Months
                    <span className="text-sm">300,000 ugx</span>
                  </Tab>
                  <Tab
                    _selected={{ border: "1px", borderColor: "green" }}
                    className="flex flex-col"
                  >
                    6 Months
                    <span className="text-sm">530,000 ugx</span>
                  </Tab>
                  <Tab
                    _selected={{ border: "1px", borderColor: "green" }}
                    className="flex flex-col"
                  >
                    1 year
                    <span className="text-sm">1,600,000 ugx</span>
                  </Tab>
                </TabList>
                <TabPanels>
                  <TabPanel>
                    <div>
                      <ul className="max-w-md divide-y divide-dotted divide-gray-200 dark:divide-gray-700">
                        <li className="pb-3 sm:pb-4">
                          <div className="flex items-center space-x-4 rtl:space-x-reverse">
                            <div className="flex-1 min-w-0">
                              <Text className="text-sm font-medium text-gray-900 truncate dark:text-white">
                                Adverts
                              </Text>
                            </div>
                            <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                              1 advert
                            </div>
                          </div>
                        </li>
                        <li className="py-3 sm:py-4">
                          <div className="flex items-center space-x-4 rtl:space-x-reverse">
                            <div className="flex-1 min-w-0">
                              <Text className="text-sm font-medium text-gray-900 truncate dark:text-white">
                                access to pro sales
                              </Text>
                            </div>
                            <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                              <SmallCloseIcon />
                            </div>
                          </div>
                        </li>
                        <li className="py-3 sm:py-4">
                          <div className="flex items-center space-x-4 rtl:space-x-reverse">
                            <div className="flex-1 min-w-0">
                              <Text className="text-sm font-medium text-gray-900 truncate dark:text-white">
                                yookatale insights
                              </Text>
                            </div>
                            <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                              <SmallCloseIcon />
                            </div>
                          </div>
                        </li>
                        <li className="py-3 sm:py-4">
                          <div className="flex items-center space-x-4 rtl:space-x-reverse">
                            <div className="flex-1 min-w-0">
                              <Text className="text-sm font-medium text-gray-900 truncate dark:text-white">
                                emails & social media link
                              </Text>
                            </div>
                            <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                              <SmallCloseIcon />
                            </div>
                          </div>
                        </li>
                        <li className="pt-3 pb-0 sm:pt-4">
                          <div className="flex items-center space-x-4 rtl:space-x-reverse">
                            <div className="flex-1 min-w-0">
                              <Text className="text-sm font-medium text-gray-900 truncate dark:text-white">
                                personal manager
                              </Text>
                            </div>
                            <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                              <SmallCloseIcon />
                            </div>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </TabPanel>
                  <TabPanel>
                    <div>
                      <ul className="max-w-md divide-y divide-dotted divide-gray-200 dark:divide-gray-700">
                        <li className="pb-3 sm:pb-4">
                          <div className="flex items-center space-x-4 rtl:space-x-reverse">
                            <div className="flex-1 min-w-0">
                              <Text className="text-sm font-medium text-gray-900 truncate dark:text-white">
                                Adverts
                              </Text>
                            </div>
                            <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                              2 adverts
                            </div>
                          </div>
                        </li>
                        <li className="py-3 sm:py-4">
                          <div className="flex items-center space-x-4 rtl:space-x-reverse">
                            <div className="flex-1 min-w-0">
                              <Text className="text-sm font-medium text-gray-900 truncate dark:text-white">
                                access to pro sales
                              </Text>
                            </div>
                            <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                              <SmallCloseIcon />
                            </div>
                          </div>
                        </li>
                        <li className="py-3 sm:py-4">
                          <div className="flex items-center space-x-4 rtl:space-x-reverse">
                            <div className="flex-1 min-w-0">
                              <Text className="text-sm font-medium text-gray-900 truncate dark:text-white">
                                yookatale insights
                              </Text>
                            </div>
                            <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                              <SmallCloseIcon />
                            </div>
                          </div>
                        </li>
                        <li className="py-3 sm:py-4">
                          <div className="flex items-center space-x-4 rtl:space-x-reverse">
                            <div className="flex-1 min-w-0">
                              <Text className="text-sm font-medium text-gray-900 truncate dark:text-white">
                                emails & social media link
                              </Text>
                            </div>
                            <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                              <SmallCloseIcon />
                            </div>
                          </div>
                        </li>
                        <li className="pt-3 pb-0 sm:pt-4">
                          <div className="flex items-center space-x-4 rtl:space-x-reverse">
                            <div className="flex-1 min-w-0">
                              <Text className="text-sm font-medium text-gray-900 truncate dark:text-white">
                                personal manager
                              </Text>
                            </div>
                            <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                              <SmallCloseIcon />
                            </div>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </TabPanel>
                  <TabPanel>
                    <div>
                      <ul className="max-w-md divide-y divide-dotted divide-gray-200 dark:divide-gray-700">
                        <li className="pb-3 sm:pb-4">
                          <div className="flex items-center space-x-4 rtl:space-x-reverse">
                            <div className="flex-1 min-w-0">
                              <Text className="text-sm font-medium text-gray-900 truncate dark:text-white">
                                Adverts
                              </Text>
                            </div>
                            <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                              3 adverts
                            </div>
                          </div>
                        </li>
                        <li className="py-3 sm:py-4">
                          <div className="flex items-center space-x-4 rtl:space-x-reverse">
                            <div className="flex-1 min-w-0">
                              <Text className="text-sm font-medium text-gray-900 truncate dark:text-white">
                                access to pro sales
                              </Text>
                            </div>
                            <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                              <SmallCloseIcon />
                            </div>
                          </div>
                        </li>
                        <li className="py-3 sm:py-4">
                          <div className="flex items-center space-x-4 rtl:space-x-reverse">
                            <div className="flex-1 min-w-0">
                              <Text className="text-sm font-medium text-gray-900 truncate dark:text-white">
                                yookatale insights
                              </Text>
                            </div>
                            <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                              <SmallCloseIcon />
                            </div>
                          </div>
                        </li>
                        <li className="py-3 sm:py-4">
                          <div className="flex items-center space-x-4 rtl:space-x-reverse">
                            <div className="flex-1 min-w-0">
                              <Text className="text-sm font-medium text-gray-900 truncate dark:text-white">
                                emails & social media link
                              </Text>
                            </div>
                            <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                              <SmallCloseIcon />
                            </div>
                          </div>
                        </li>
                        <li className="pt-3 pb-0 sm:pt-4">
                          <div className="flex items-center space-x-4 rtl:space-x-reverse">
                            <div className="flex-1 min-w-0">
                              <Text className="text-sm font-medium text-gray-900 truncate dark:text-white">
                                personal manager
                              </Text>
                            </div>
                            <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                              <SmallCloseIcon />
                            </div>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </TabPanel>
                  <TabPanel>
                    <div>
                      <ul className="max-w-md divide-y divide-dotted divide-gray-200 dark:divide-gray-700">
                        <li className="pb-3 sm:pb-4">
                          <div className="flex items-center space-x-4 rtl:space-x-reverse">
                            <div className="flex-1 min-w-0">
                              <Text className="text-sm font-medium text-gray-900 truncate dark:text-white">
                                Adverts
                              </Text>
                            </div>
                            <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                              6 adverts
                            </div>
                          </div>
                        </li>
                        <li className="py-3 sm:py-4">
                          <div className="flex items-center space-x-4 rtl:space-x-reverse">
                            <div className="flex-1 min-w-0">
                              <Text className="text-sm font-medium text-gray-900 truncate dark:text-white">
                                access to pro sales
                              </Text>
                            </div>
                            <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                              <CheckIcon />
                            </div>
                          </div>
                        </li>
                        <li className="py-3 sm:py-4">
                          <div className="flex items-center space-x-4 rtl:space-x-reverse">
                            <div className="flex-1 min-w-0">
                              <Text className="text-sm font-medium text-gray-900 truncate dark:text-white">
                                yookatale insights
                              </Text>
                            </div>
                            <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                              <CheckIcon />
                            </div>
                          </div>
                        </li>
                        <li className="py-3 sm:py-4">
                          <div className="flex items-center space-x-4 rtl:space-x-reverse">
                            <div className="flex-1 min-w-0">
                              <Text className="text-sm font-medium text-gray-900 truncate dark:text-white">
                                emails & social media link
                              </Text>
                            </div>
                            <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                              <SmallCloseIcon />
                            </div>
                          </div>
                        </li>
                        <li className="pt-3 pb-0 sm:pt-4">
                          <div className="flex items-center space-x-4 rtl:space-x-reverse">
                            <div className="flex-1 min-w-0">
                              <Text className="text-sm font-medium text-gray-900 truncate dark:text-white">
                                personal manager
                              </Text>
                            </div>
                            <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                              <SmallCloseIcon />
                            </div>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </TabPanel>
                  <TabPanel>
                    <div>
                      <ul className="max-w-md divide-y divide-dotted divide-gray-200 dark:divide-gray-700">
                        <li className="pb-3 sm:pb-4">
                          <div className="flex items-center space-x-4 rtl:space-x-reverse">
                            <div className="flex-1 min-w-0">
                              <Text className="text-sm font-medium text-gray-900 truncate dark:text-white">
                                Adverts
                              </Text>
                            </div>
                            <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                              9 adverts
                            </div>
                          </div>
                        </li>
                        <li className="py-3 sm:py-4">
                          <div className="flex items-center space-x-4 rtl:space-x-reverse">
                            <div className="flex-1 min-w-0">
                              <Text className="text-sm font-medium text-gray-900 truncate dark:text-white">
                                access to pro sales
                              </Text>
                            </div>
                            <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                              <CheckIcon />
                            </div>
                          </div>
                        </li>
                        <li className="py-3 sm:py-4">
                          <div className="flex items-center space-x-4 rtl:space-x-reverse">
                            <div className="flex-1 min-w-0">
                              <Text className="text-sm font-medium text-gray-900 truncate dark:text-white">
                                yookatale insights
                              </Text>
                            </div>
                            <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                              <CheckIcon />
                            </div>
                          </div>
                        </li>
                        <li className="py-3 sm:py-4">
                          <div className="flex items-center space-x-4 rtl:space-x-reverse">
                            <div className="flex-1 min-w-0">
                              <Text className="text-sm font-medium text-gray-900 truncate dark:text-white">
                                emails & social media link
                              </Text>
                            </div>
                            <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                              <CheckIcon />
                            </div>
                          </div>
                        </li>
                        <li className="pt-3 pb-0 sm:pt-4">
                          <div className="flex items-center space-x-4 rtl:space-x-reverse">
                            <div className="flex-1 min-w-0">
                              <Text className="text-sm font-medium text-gray-900 truncate dark:text-white">
                                personal manager
                              </Text>
                            </div>
                            <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                              <CheckIcon />
                            </div>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </Card>
          </TabPanel>
          <TabPanel className="-ml-7 -mr-7">
            <Card>
              <Tabs variant="unstyled">
                <TabList className="overflow-x-auto">
                  <Tab
                    _selected={{ border: "1px", borderColor: "green" }}
                    className="flex flex-col"
                  >
                    Monthly
                    <span className="text-sm">600,000 ugx</span>
                  </Tab>
                  <Tab
                    _selected={{ border: "1px", borderColor: "green" }}
                    className="flex flex-col"
                  >
                    3 Months
                    <span className="text-sm">1,600,000 ugx</span>
                  </Tab>
                  <Tab
                    _selected={{ border: "1px", borderColor: "green" }}
                    className="flex flex-col"
                  >
                    6 Months
                    <span className="text-sm">3,200,000 ugx</span>
                  </Tab>
                </TabList>
                <TabPanels>
                  <TabPanel>
                    <div>
                      <ul className="max-w-md divide-y divide-dotted divide-gray-200 dark:divide-gray-700">
                        <li className="pb-3 sm:pb-4">
                          <div className="flex items-center space-x-4 rtl:space-x-reverse">
                            <div className="flex-1 min-w-0">
                              <Text className="text-sm font-medium text-gray-900 truncate dark:text-white">
                                Adverts
                              </Text>
                            </div>
                            <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                              2 adverts
                            </div>
                          </div>
                        </li>
                        <li className="py-3 sm:py-4">
                          <div className="flex items-center space-x-4 rtl:space-x-reverse">
                            <div className="flex-1 min-w-0">
                              <Text className="text-sm font-medium text-gray-900 truncate dark:text-white">
                                access to pro sales
                              </Text>
                            </div>
                            <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                              <CheckIcon />
                            </div>
                          </div>
                        </li>
                        <li className="py-3 sm:py-4">
                          <div className="flex items-center space-x-4 rtl:space-x-reverse">
                            <div className="flex-1 min-w-0">
                              <Text className="text-sm font-medium text-gray-900 truncate dark:text-white">
                                yookatale insights
                              </Text>
                            </div>
                            <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                              <SmallCloseIcon />
                            </div>
                          </div>
                        </li>
                        <li className="py-3 sm:py-4">
                          <div className="flex items-center space-x-4 rtl:space-x-reverse">
                            <div className="flex-1 min-w-0">
                              <Text className="text-sm font-medium text-gray-900 truncate dark:text-white">
                                emails & social media link
                              </Text>
                            </div>
                            <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                              <SmallCloseIcon />
                            </div>
                          </div>
                        </li>
                        <li className="pt-3 pb-0 sm:pt-4">
                          <div className="flex items-center space-x-4 rtl:space-x-reverse">
                            <div className="flex-1 min-w-0">
                              <Text className="text-sm font-medium text-gray-900 truncate dark:text-white">
                                personal manager
                              </Text>
                            </div>
                            <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                              <SmallCloseIcon />
                            </div>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </TabPanel>
                  <TabPanel>
                    <div>
                      <ul className="max-w-md divide-y divide-dotted divide-gray-200 dark:divide-gray-700">
                        <li className="pb-3 sm:pb-4">
                          <div className="flex items-center space-x-4 rtl:space-x-reverse">
                            <div className="flex-1 min-w-0">
                              <Text className="text-sm font-medium text-gray-900 truncate dark:text-white">
                                Adverts
                              </Text>
                            </div>
                            <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                              3 adverts
                            </div>
                          </div>
                        </li>
                        <li className="py-3 sm:py-4">
                          <div className="flex items-center space-x-4 rtl:space-x-reverse">
                            <div className="flex-1 min-w-0">
                              <Text className="text-sm font-medium text-gray-900 truncate dark:text-white">
                                access to pro sales
                              </Text>
                            </div>
                            <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                              <CheckIcon />
                            </div>
                          </div>
                        </li>
                        <li className="py-3 sm:py-4">
                          <div className="flex items-center space-x-4 rtl:space-x-reverse">
                            <div className="flex-1 min-w-0">
                              <Text className="text-sm font-medium text-gray-900 truncate dark:text-white">
                                yookatale insights
                              </Text>
                            </div>
                            <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                              <CheckIcon />
                            </div>
                          </div>
                        </li>
                        <li className="py-3 sm:py-4">
                          <div className="flex items-center space-x-4 rtl:space-x-reverse">
                            <div className="flex-1 min-w-0">
                              <Text className="text-sm font-medium text-gray-900 truncate dark:text-white">
                                emails & social media link
                              </Text>
                            </div>
                            <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                              <CheckIcon />
                            </div>
                          </div>
                        </li>
                        <li className="pt-3 pb-0 sm:pt-4">
                          <div className="flex items-center space-x-4 rtl:space-x-reverse">
                            <div className="flex-1 min-w-0">
                              <Text className="text-sm font-medium text-gray-900 truncate dark:text-white">
                                personal manager
                              </Text>
                            </div>
                            <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                              <SmallCloseIcon />
                            </div>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </TabPanel>
                  <TabPanel>
                    <div>
                      <ul className="max-w-md divide-y divide-dotted divide-gray-200 dark:divide-gray-700">
                        <li className="pb-3 sm:pb-4">
                          <div className="flex items-center space-x-4 rtl:space-x-reverse">
                            <div className="flex-1 min-w-0">
                              <Text className="text-sm font-medium text-gray-900 truncate dark:text-white">
                                Adverts
                              </Text>
                            </div>
                            <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                              6 adverts
                            </div>
                          </div>
                        </li>
                        <li className="py-3 sm:py-4">
                          <div className="flex items-center space-x-4 rtl:space-x-reverse">
                            <div className="flex-1 min-w-0">
                              <Text className="text-sm font-medium text-gray-900 truncate dark:text-white">
                                access to pro sales
                              </Text>
                            </div>
                            <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                              <CheckIcon />
                            </div>
                          </div>
                        </li>
                        <li className="py-3 sm:py-4">
                          <div className="flex items-center space-x-4 rtl:space-x-reverse">
                            <div className="flex-1 min-w-0">
                              <Text className="text-sm font-medium text-gray-900 truncate dark:text-white">
                                yookatale insights
                              </Text>
                            </div>
                            <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                              <CheckIcon />
                            </div>
                          </div>
                        </li>
                        <li className="py-3 sm:py-4">
                          <div className="flex items-center space-x-4 rtl:space-x-reverse">
                            <div className="flex-1 min-w-0">
                              <Text className="text-sm font-medium text-gray-900 truncate dark:text-white">
                                emails & social media link
                              </Text>
                            </div>
                            <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                              <CheckIcon />
                            </div>
                          </div>
                        </li>
                        <li className="pt-3 pb-0 sm:pt-4">
                          <div className="flex items-center space-x-4 rtl:space-x-reverse">
                            <div className="flex-1 min-w-0">
                              <Text className="text-sm font-medium text-gray-900 truncate dark:text-white">
                                feedback management tool
                              </Text>
                            </div>
                            <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                              <CheckIcon />
                            </div>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </Card>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
}

export default MobileView;
