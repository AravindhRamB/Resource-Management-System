'use client';
import { Form, Input, Button, DatePicker, Select, Card, Row, Col, Checkbox, Space, Divider, Upload, Radio, Steps, message } from 'antd';
import { App as AntdApp } from 'antd';
import { useState } from 'react';
import dayjs from 'dayjs';
import { submitJoiningForm } from '@/services/authServices';
import { UploadOutlined } from '@ant-design/icons';

const { Option } = Select;
const { TextArea } = Input;

export default function ProfilePage(){
    
    const [current, setCurrent] = useState(0);
    const [form] = Form.useForm();
    const [allFormData, setAllFormData] = useState<any>({});
    const antdApp = AntdApp.useApp();
    const modal = antdApp.modal;

     const dateRangeValidator = (startFieldName: string, endFieldName: string) => {
        return {
            validator: (_: any, value: any) => {
                if (!value) return Promise.resolve();

                const formValues = form.getFieldsValue();
                const startDate = formValues[startFieldName];
                const endDate = formValues[endFieldName];

                if (startDate && endDate && dayjs(startDate).isAfter(dayjs(endDate))) {
                    return Promise.reject(new Error('Start date must be before end date'));
                }

                return Promise.resolve();
            }
        };
    };

    // Custom validator for education duration
    const educationDurationValidator = (fieldIndex: number, isEndDate: boolean = false) => {
        return {
            validator: (_: any, value: any) => {
                if (!value) return Promise.resolve();

                const formValues = form.getFieldsValue();
                const educationDetails = formValues.educationDetails || [];
                const currentEducation = educationDetails[fieldIndex];

                if (currentEducation && currentEducation.durationFrom && currentEducation.durationTo) {
                    if (dayjs(currentEducation.durationFrom).isAfter(dayjs(currentEducation.durationTo))) {
                        return Promise.reject(new Error('Start date must be before end date'));
                    }
                }

                return Promise.resolve();
            }
        };
    };

    // Custom validator for employment period
    const employmentPeriodValidator = (fieldIndex: number, isEndDate: boolean = false) => {
        return {
            validator: (_: any, value: any) => {
                if (!value) return Promise.resolve();

                const formValues = form.getFieldsValue();
                const previousEmployments = formValues.previousEmployments || [];
                const currentEmployment = previousEmployments[fieldIndex];

                if (currentEmployment && currentEmployment.periodFrom && currentEmployment.periodTo) {
                    if (dayjs(currentEmployment.periodFrom).isAfter(dayjs(currentEmployment.periodTo))) {
                        return Promise.reject(new Error('Start date must be before end date'));
                    }
                }

                return Promise.resolve();
            }
        };
    };

    const next = async () => {
        try {
            const currentStepValues = await form.validateFields();
            setAllFormData((prevData: any) => ({ ...prevData, ...currentStepValues }));
            setCurrent(current + 1);
            form.resetFields();
        } catch (info) {
            console.log('Validate Failed:', info);
            message.error('Please fill in all required fields and fix any validation errors on this page.');
        }
    };

    const prev = () => {
        const currentStepValues = form.getFieldsValue();
        setAllFormData((prevData: any) => ({ ...prevData, ...currentStepValues }));
        setCurrent(current - 1);
        form.resetFields();
    };
     const formatDateToString = (date: any): string => {
            if (!date) return '';
    
            // Handle both Dayjs objects and Date objects
            const dayjsDate = dayjs.isDayjs(date) ? date : dayjs(date);
            return dayjsDate.format('MM-DD-YYYY');
        };
    
        // Format month-year dates
        const formatMonthYearToString = (date: any): string => {
            if (!date) return '';
    
            const dayjsDate = dayjs.isDayjs(date) ? date : dayjs(date);
            return dayjsDate.format('MM-YYYY');
        };
    
        const onFinish = async () => {
    try {
        const finalStepValues = await form.validateFields();
        const finalFormData = { ...allFormData, ...finalStepValues };

        console.log('Final submitted values (before transformation):', finalFormData);

        message.loading('Submitting your application...', 0);

        // Create JSON payload without files
        const jsonPayload = {
            // ... (your existing jsonPayload logic)
            salutation: finalFormData.salutation || '',
            first_name: finalFormData.firstName || '',
            middleName: finalFormData.middleName || '',
            last_name: finalFormData.lastName || '',
            phone: finalFormData.phoneNumber || '',
            email: finalFormData.email || '',
            gender: finalFormData.gender || '',
            father_name: finalFormData.fatherName || '',
            mother_name: finalFormData.motherName || '',
            date_of_birth: formatDateToString(finalFormData.dateOfBirth),
            place_of_birth: finalFormData.placeOfBirth || '',
            nationality: finalFormData.nationality || '',
            marital_status: finalFormData.maritalStatus || '',
            present_address: finalFormData.presentAddress || '',
            present_address_pincode: finalFormData.presentAddressPincode || '',
            permanent_address: finalFormData.permanentAddress || '',
            permanent_address_pincode: finalFormData.permanentAddressPincode || '',
            passport_no: finalFormData.passportNo || '',
            passport_issue_date: formatDateToString(finalFormData.passportIssueDate),
            passport_issue_place: finalFormData.passportPlaceOfIssue || '',
            passport_expiry_date: formatDateToString(finalFormData.passportExpiryDate),
            appliedForPassport: finalFormData.appliedForPassport || '',
            educationDetails: finalFormData.educationDetails?.map((edu: any) => ({
                education_level: edu.educationLevel || '',
                instituation_name: edu.college || '',
                degree: edu.degree || '',
                course_start_date: formatMonthYearToString(edu.durationFrom),
                course_end_date: formatMonthYearToString(edu.durationTo),
                specialization: edu.specialization || '',
                percentage: edu.percentage || '',
            })) || [],
            acc_number: finalFormData.accountNumber || '',
            ifsc_code: finalFormData.ifscCode || '',
            bank_name: finalFormData.bankName || '',
            branch: finalFormData.bankBranch || '',
            employmentStatus: finalFormData.employmentStatus || '',
            previousEmployments: finalFormData.previousEmployments?.map((emp: any) => ({
                prev_employer_name: emp.employerName || '',
                prev_emp_id: emp.empId || '',
                periodFrom: formatDateToString(emp.periodFrom),
                periodTo: formatDateToString(emp.periodTo),
                designation: emp.designation || '',
                prev_salary_drawn: emp.lastSalary || '',
                duty_description: emp.duties || '',
                prev_address: emp.address || '',
            })) || [],
            date_of_join: formatDateToString(finalFormData.joiningDate),
            declaration: Boolean(finalFormData.declaration),
        };

        console.log('JSON Payload:', jsonPayload);

        // Submit the form
        const response = await submitJoiningForm(jsonPayload);

        if (response.success) {
            message.destroy();
            // Clear the form and state right after successful API response
            form.resetFields();
            setAllFormData({});
            setCurrent(0);

            // Show success popup
            modal.success({
                title: 'Success',
                content: (
                    <>
                        Employee added successfully!
                        {response.applicationId && (
                            <div style={{ marginTop: 8 }}>
                                Application ID: {response.applicationId}
                            </div>
                        )}
                    </>
                ),
            });
        } else {
            message.destroy();
            // Show error popup
            modal.error({
                title: 'Submission Failed',
                content: response.message || 'Submission failed',
            });
        }

    } 
    catch (error) {
        message.destroy();
        console.error('Form submission error:', error);

        modal.error({
            title: 'Submission Failed',
            content:
                error instanceof Error
                    ? `Submission failed: ${error.message}`
                    : 'An unexpected error occurred while submitting the form.',
        });
    }
};
            
        
        const steps = [
            {
                title: 'Personal Info',
                description: 'Basic personal details',
                content: (
                    <Card title="Personal Information" className="shadow-lg mb-6 mt-3">
                        <Row gutter={16}>
                            <Col xs={24} md={8}>
                                <Form.Item name="salutation" label="Mr./Ms." rules={[{ required: true, message: 'Please select a salutation!' }]}>
                                    <Select>
                                        <Option value="Mr.">Mr.</Option>
                                        <Option value="Ms.">Ms.</Option>
                                        <Option value="Mrs.">Mrs.</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={8}>
                                <Form.Item name="firstName" label="First/Given Name" rules={[{ required: true, message: 'Please enter your first name!' }]}>
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={8}>
                                <Form.Item name="middleName" label="Middle Name">
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={8}>
                                <Form.Item name="lastName" label="Surname / Last Name" rules={[{ required: true, message: 'Please enter your last name!' }]}>
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={8}>
                                <Form.Item name="phoneNumber" label="Phone Number" rules={[{ required: true, message: 'Please enter your phone number!' }]}>
                                    <Input type="tel" placeholder="Enter your phone number" />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={8}>
                                <Form.Item name="email" label="Email" rules={[{ type: 'email', message: 'Please enter a valid email!' }]}>
                                    <Input type="email" placeholder="Enter your email address" />
                                </Form.Item>
                            </Col>
                            <Col>
                            <Form.Item name="gender" label="Gender" rules={[{ required: true, message: 'Please select your gender!' }]}>
                               <Select placeholder="Select your gender">
                                <Option value="female">Female</Option>
                                <Option value="male">Male</Option>
                                <Option value="other">Other</Option>
                                </Select>
    
                            </Form.Item>
                            </Col>
                            
                            <Col xs={24} md={8}>
                                <Form.Item name="fatherName" label="Name of Father" rules={[{ required: true, message: 'Please enter your father\'s name!' }]}>
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={8}>
                                <Form.Item name="motherName" label="Name of Mother">
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={8}>
                                <Form.Item name="dateOfBirth" label="Date of Birth" rules={[{ required: true, message: 'Please select your date of birth!' }]}>
                                    <DatePicker
                                        className="w-full"
                                        format="MM-DD-YYYY"
                                        disabledDate={(current) => current && current > dayjs().endOf('day')}
                                    />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={8}>
                                <Form.Item name="placeOfBirth" label="Place of Birth">
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={8}>
                                <Form.Item name="nationality" label="Nationality" rules={[{ required: true, message: 'Please enter your nationality!' }]}>
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={8}>
                                <Form.Item name="maritalStatus" label="Marital Status" rules={[{ required: true, message: 'Please select your marital status!' }]}>
                                    <Select>
                                        <Option value="single">Single</Option>
                                        <Option value="married">Married</Option>
                                        <Option value="divorced">Divorced</Option>
                                        <Option value="widowed">Widowed</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={8}>
                                <Form.Item name="presentAddress" label="Present Address" rules={[{ required: true, message: 'Please enter your present address!' }]}>
                                    <Input.TextArea rows={3} placeholder="Enter your present address" />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={8}>
                                <Form.Item name="presentAddressPincode" label="Present Address Pincode" rules={[{ required: true, message: 'Please enter your present address pincode!' }]}>
                                    <Input placeholder="Enter your present address pincode" />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={8}>
                                <Form.Item name="permanentAddress" label="Permanent Address">
                                    <Input.TextArea rows={3} placeholder="Enter your permanent address" />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={8}>
                                <Form.Item name="permanentAddressPincode" label="Permanent Address Pincode">
                                    <Input placeholder="Enter your permanent address pincode" />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Card title="Passport Information" className="shadow-lg mt-6">
                            <Row gutter={16}>
                                <Col xs={24} md={12}>
                                    <Form.Item name="passportNo" label="Passport No:">
                                        <Input />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={12}>
                                    <Form.Item
                                        name="passportIssueDate"
                                        label="Dt. of PP Issue:"
                                        rules={[dateRangeValidator('passportIssueDate', 'passportExpiryDate')]}
                                    >
                                        <DatePicker className="w-full" format="MM-DD-YYYY" />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={12}>
                                    <Form.Item name="passportPlaceOfIssue" label="Place of PP Issue:">
                                        <Input />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={12}>
                                    <Form.Item
                                        name="passportExpiryDate"
                                        label="Dt. of PP Expiry:"
                                        rules={[dateRangeValidator('passportIssueDate', 'passportExpiryDate')]}
                                    >
                                        <DatePicker className="w-full" format="MM-DD-YYYY" />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Card>
                    </Card>
                ),
            },
            {
                title: 'Education & Docs',
                description: 'Educational background',
                content: (
                    <>
                        <Card title="Education Details & Attachments" className="shadow-lg mb-6">
                            <Row gutter={16}>
                                <Col xs={24} md={12}>
                                    <Form.Item
                                        name="sscMarksCard"
                                        label="10th Marks Card"
                                        valuePropName="fileList"
                                        getValueFromEvent={(e) => {
                                            if (Array.isArray(e)) {
                                                return e;
                                            }
                                            return e?.fileList;
                                        }}
                                    >
                                        <Upload
                                            name="sscMarksCard"
                                            beforeUpload={() => false}
                                            maxCount={1}
                                            listType="text"
                                            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                                        >
                                            <Button icon={<UploadOutlined />}>Upload File</Button>
                                        </Upload>
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={12}>
                                    <Form.Item
                                        name="hscMarksCard"
                                        label="12th Marks Card"
                                        valuePropName="fileList"
                                        getValueFromEvent={(e) => {
                                            if (Array.isArray(e)) {
                                                return e;
                                            }
                                            return e?.fileList;
                                        }}
                                    >
                                        <Upload
                                            name="hscMarksCard"
                                            beforeUpload={() => false}
                                            maxCount={1}
                                            listType="text"
                                            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                                        >
                                            <Button icon={<UploadOutlined />}>Upload File</Button>
                                        </Upload>
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={12}>
                                    <Form.Item
                                        name="degreeCertificate"
                                        label="Degree Certificate"
                                        valuePropName="fileList"
                                        getValueFromEvent={(e) => {
                                            if (Array.isArray(e)) {
                                                return e;
                                            }
                                            return e?.fileList;
                                        }}
                                    >
                                        <Upload
                                            name="degreeCertificate"
                                            beforeUpload={() => false}
                                            maxCount={1}
                                            listType="text"
                                            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                                        >
                                            <Button icon={<UploadOutlined />}>Upload File</Button>
                                        </Upload>
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Form.List name="educationDetails">
                                {(fields, { add, remove }) => (
                                    <>
                                        {fields.map(({ key, name, ...restField }) => (
                                            <Card key={key} size="small" extra={<Button type="link" onClick={() => remove(name)}>Remove</Button>} className="mt-4">
                                                <Row gutter={16}>
                                                    <Col xs={24} md={8}>
                                                        <Form.Item
                                                            {...restField}
                                                            name={[name, 'educationLevel']}
                                                            label="Education Level"
                                                        >
                                                            <Select placeholder="Select level">
                                                                <Option value="10th">10th</Option>
                                                                <Option value="12th">12th</Option>
                                                                <Option value="graduation">Graduation</Option>
                                                                <Option value="postGraduation">Post-Graduation</Option>
                                                                <Option value="diploma">Diploma</Option>
                                                            </Select>
                                                        </Form.Item>
                                                    </Col>
                                                    <Col xs={24} md={8}>
                                                        <Form.Item
                                                            {...restField}
                                                            name={[name, 'college']}
                                                            label="College/University"
                                                        >
                                                            <Input />
                                                        </Form.Item>
                                                    </Col>
                                                    <Col xs={24} md={8}>
                                                        <Form.Item
                                                            {...restField}
                                                            name={[name, 'degree']}
                                                            label="Degree/Level"
                                                        >
                                                            <Input />
                                                        </Form.Item>
                                                    </Col>
                                                    <Col xs={24} md={12}>
                                                        <Row gutter={8}>
                                                            <Col span={12}>
                                                                <Form.Item
                                                                    {...restField}
                                                                    name={[name, 'durationFrom']}
                                                                    label="Duration From"
                                                                    rules={[educationDurationValidator(name)]}
                                                                >
                                                                    <DatePicker picker="month" placeholder="From" className="w-full" />
                                                                </Form.Item>
                                                            </Col>
                                                            <Col span={12}>
                                                                <Form.Item
                                                                    {...restField}
                                                                    name={[name, 'durationTo']}
                                                                    label="Duration To"
                                                                    rules={[educationDurationValidator(name, true)]}
                                                                >
                                                                    <DatePicker picker="month" placeholder="To" className="w-full" />
                                                                </Form.Item>
                                                            </Col>
                                                        </Row>
                                                    </Col>
                                                    <Col xs={24} md={12}>
                                                        <Form.Item
                                                            {...restField}
                                                            name={[name, 'specialization']}
                                                            label="Specialization"
                                                        >
                                                            <Input />
                                                        </Form.Item>
                                                    </Col>
                                                    <Col xs={24} md={12}>
                                                        <Form.Item
                                                            {...restField}
                                                            name={[name, 'percentage']}
                                                            label="Percentage"
                                                        >
                                                            <Input />
                                                        </Form.Item>
                                                    </Col>
                                                </Row>
                                            </Card>
                                        ))}
                                        <Form.Item className="mt-4">
                                            <Button type="dashed" onClick={() => add()} block>
                                                + Add Education
                                            </Button>
                                        </Form.Item>
                                    </>
                                )}
                            </Form.List>
                        </Card>
                    </>
                ),
            },
            {
                title: 'Employment & Bank',
                description: 'Work history and banking',
                content: (
                    <>
                        <Card title="Documents & Bank Details" className="shadow-lg mb-6">
                            <Row gutter={16}>
                                <Col xs={24} md={12}>
                                    <Form.Item
                                        name="aadharCard"
                                        label="Aadhar Card"
                                        valuePropName="fileList"
                                        getValueFromEvent={(e) => {
                                            if (Array.isArray(e)) {
                                                return e;
                                            }
                                            return e?.fileList;
                                        }}
                                    >
                                        <Upload
                                            name="aadharCard"
                                            beforeUpload={() => false}
                                            maxCount={1}
                                            listType="text"
                                            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                                        >
                                            <Button icon={<UploadOutlined />}>Upload File</Button>
                                        </Upload>
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={12}>
                                    <Form.Item
                                        name="panCard"
                                        label="PAN Card"
                                        valuePropName="fileList"
                                        getValueFromEvent={(e) => {
                                            if (Array.isArray(e)) {
                                                return e;
                                            }
                                            return e?.fileList;
                                        }}
                                    >
                                        <Upload
                                            name="panCard"
                                            beforeUpload={() => false}
                                            maxCount={1}
                                            listType="text"
                                            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                                        >
                                            <Button icon={<UploadOutlined />}>Upload File</Button>
                                        </Upload>
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={12}>
                                    <Form.Item
                                        name="bankDetailsAttachment"
                                        label="Bank Details Proof (Cheque/Passbook)"
                                        valuePropName="fileList"
                                        getValueFromEvent={(e) => {
                                            if (Array.isArray(e)) {
                                                return e;
                                            }
                                            return e?.fileList;
                                        }}
                                    >
                                        <Upload
                                            name="bankDetailsAttachment"
                                            beforeUpload={() => false}
                                            maxCount={1}
                                            listType="text"
                                            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                                        >
                                            <Button icon={<UploadOutlined />}>Upload File</Button>
                                        </Upload>
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Divider />
                            <h3 className="text-lg font-semibold mb-4">Bank Details</h3>
                            <Row gutter={16}>
                                <Col xs={24} md={12}>
                                    <Form.Item name="accountNumber" label="Account Number" rules={[{ required: true, message: 'Please enter the account number!' }]}>
                                        <Input />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={12}>
                                    <Form.Item name="ifscCode" label="IFSC Code" rules={[{ required: true, message: 'Please enter the IFSC code!' }]}>
                                        <Input />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={12}>
                                    <Form.Item name="bankName" label="Bank Name" rules={[{ required: true, message: 'Please enter the bank name!' }]}>
                                        <Input />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={12}>
                                    <Form.Item name="bankBranch" label="Branch" rules={[{ required: true, message: 'Please enter the bank branch!' }]}>
                                        <Input />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Card>
                        <Card title="Employment History & Documents" className="shadow-lg mb-6">
                            <Form.Item name="employmentStatus" label="Are you an experienced employee?">
                                <Radio.Group>
                                    <Radio value="yes">Yes</Radio>
                                    <Radio value="no">No</Radio>
                                </Radio.Group>
                            </Form.Item>
                            <Form.Item
                                name="resume"
                                label="Resume"
                                valuePropName="fileList"
                                getValueFromEvent={(e) => {
                                    if (Array.isArray(e)) {
                                        return e;
                                    }
                                    return e?.fileList;
                                }}
                            >
                                <Upload
                                    name="resume"
                                    beforeUpload={() => false}
                                    maxCount={1}
                                    listType="text"
                                    accept=".pdf,.doc,.docx"
                                >
                                    <Button icon={<UploadOutlined />}>Upload File</Button>
                                </Upload>
                            </Form.Item>
                            <Form.Item shouldUpdate={(prevValues, curValues) => prevValues.employmentStatus !== curValues.employmentStatus}>
                                {({ getFieldValue }) =>
                                    getFieldValue('employmentStatus') === 'yes' ? (
                                        <Row gutter={16}>
                                            <Col xs={24} md={12}>
                                                <Form.Item
                                                    name="experienceLetter"
                                                    label="Experience Letter"
                                                    valuePropName="fileList"
                                                    getValueFromEvent={(e) => {
                                                        if (Array.isArray(e)) {
                                                            return e;
                                                        }
                                                        return e?.fileList;
                                                    }}
                                                >
                                                    <Upload
                                                        name="experienceLetter"
                                                        beforeUpload={() => false}
                                                        maxCount={1}
                                                        listType="text"
                                                        accept=".pdf,.doc,.docx"
                                                    >
                                                        <Button icon={<UploadOutlined />}>Upload File</Button>
                                                    </Upload>
                                                </Form.Item>
                                            </Col>
                                            <Col xs={24} md={12}>
                                                <Form.Item
                                                    name="lastThreeMonthsPaySlip"
                                                    label="Last 3 Months Pay Slip(All in one file)"
                                                    valuePropName="fileList"
                                                    getValueFromEvent={(e) => {
                                                        if (Array.isArray(e)) {
                                                            return e;
                                                        }
                                                        return e?.fileList;
                                                    }}
                                                >
                                                    <Upload
                                                        name="lastThreeMonthsPaySlip"
                                                        beforeUpload={() => false}
                                                        maxCount={1}
                                                        listType="text"
                                                        accept=".pdf,.doc,.docx"
                                                    >
                                                        <Button icon={<UploadOutlined />}>Upload File</Button>
                                                    </Upload>
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                    ) : null
                                }
                            </Form.Item>
                            <Form.List name="previousEmployments">
                                {(fields, { add, remove }) => (
                                    <>
                                        {fields.map(({ key, name, ...restField }) => (
                                            <Card key={key} size="small" extra={<Button type="link" onClick={() => remove(name)}>Remove</Button>} className="mt-4">
                                                <Row gutter={16}>
                                                    <Col xs={24} md={12}>
                                                        <Form.Item
                                                            {...restField}
                                                            name={[name, 'employerName']}
                                                            label="Name and Address of Employer"
                                                        >
                                                            <Input />
                                                        </Form.Item>
                                                    </Col>
                                                    <Col xs={24} md={12}>
                                                        <Form.Item
                                                            {...restField}
                                                            name={[name, 'empId']}
                                                            label="Emp Id"
                                                        >
                                                            <Input />
                                                        </Form.Item>
                                                    </Col>
                                                    <Col xs={24} md={12}>
                                                        <Form.Item
                                                            {...restField}
                                                            name={[name, 'periodFrom']}
                                                            label="Period From"
                                                            rules={[employmentPeriodValidator(name)]}
                                                        >
                                                            <DatePicker className="w-full" format="MM-DD-YYYY" />
                                                        </Form.Item>
                                                    </Col>
                                                    <Col xs={24} md={12}>
                                                        <Form.Item
                                                            {...restField}
                                                            name={[name, 'periodTo']}
                                                            label="Period To"
                                                            rules={[employmentPeriodValidator(name, true)]}
                                                        >
                                                            <DatePicker className="w-full" format="MM-DD-YYYY" />
                                                        </Form.Item>
                                                    </Col>
                                                    <Col xs={24} md={12}>
                                                        <Form.Item
                                                            {...restField}
                                                            name={[name, 'designation']}
                                                            label="Designation"
                                                        >
                                                            <Input />
                                                        </Form.Item>
                                                    </Col>
                                                    <Col xs={24} md={12}>
                                                        <Form.Item
                                                            {...restField}
                                                            name={[name, 'lastSalary']}
                                                            label="Last Salary Drawn (Per Annum)"
                                                        >
                                                            <Input />
                                                        </Form.Item>
                                                    </Col>
                                                    <Col xs={24}>
                                                        <Form.Item
                                                            {...restField}
                                                            name={[name, 'duties']}
                                                            label="Nature of Duties"
                                                        >
                                                            <TextArea rows={2} />
                                                        </Form.Item>
                                                    </Col>
                                                </Row>
                                            </Card>
                                        ))}
                                        <Form.Item className="mt-4">
                                            <Button type="dashed" onClick={() => add()} block>
                                                + Add Previous Employment
                                            </Button>
                                        </Form.Item>
                                    </>
                                )}
                            </Form.List>
                        </Card>
                    </>
                ),
            },
            {
                title: 'Declaration',
                description: 'Final confirmation',
                content: (
                    <Card title="Declaration" className="shadow-lg mb-6">
                        <Form.Item
                            name="joiningDate"
                            label="Joining Date"
                            rules={[{ required: true, message: 'Please select your joining date!' }]}
                        >
                            <DatePicker className="w-full" format="MM-DD-YYYY" />
                        </Form.Item>
                        <Form.Item
                            name="declaration"
                            valuePropName="checked"
                            rules={[
                                {
                                    validator: (_, value) =>
                                        value ? Promise.resolve() : Promise.reject(new Error('You must accept the declaration')),
                                },
                            ]}
                        >
                            <Checkbox>
                                I certify that:
                                <br />
                                1. The information furnished above is factually correct and subject to verification by LivNSense Technologies.
                                <br />
                                2. I am at present in sound mental and physical condition to undertake employment with LivNSense Technologies.
                                <br />
                                3. I accept that an appointment given to me on this basis can be revoked, if any information has been misstated or unstated.
                            </Checkbox>
                        </Form.Item>
                    </Card>
                ),
            },
        ];
    return(
 <AntdApp>
            <div className="joining-form-container">
                <Steps
                    current={current}
                    items={steps}
                    style={{
                        margin: '13px 0',
                        marginBottom: '24px',
                        padding: '16px',
                        backgroundColor: '#fafafa',
                        borderRadius: '8px',
                        border: '1px solid #d9d9d9'
                    }}
                    size="default"
                    direction="horizontal"
                />

                <Form form={form} onFinish={onFinish} layout="vertical" initialValues={allFormData}>
                    <div className="step-content">
                        {steps[current].content}
                    </div>

                    <div className="steps-action" style={{ marginTop: '24px', textAlign: 'right' }}>
                        <Space>
                            {current > 0 && (
                                <Button onClick={prev}>
                                    Previous
                                </Button>
                            )}
                            {current < steps.length - 1 && (
                                <Button type="primary" onClick={next}>
                                    Next
                                </Button>
                            )}
                            {current === steps.length - 1 && (
                                <Button type="primary" htmlType="submit">
                                    Submit Application
                                </Button>
                            )}
                        </Space>
                    </div>
                </Form>
            </div>
        </AntdApp>
    )
      
}