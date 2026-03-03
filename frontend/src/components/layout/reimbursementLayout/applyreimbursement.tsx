'use client';
import React, { useState, useEffect } from 'react';
import { Button, Col, DatePicker, Input, Row, Select, Upload, Spin, App, Form } from 'antd';
import { UploadOutlined, MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { getProjectList, getCategoryList, applyReimbursement,getDesignationList } from '@/services/authServices';
import dayjs from 'dayjs';

export function ApplyReimbursement() {
    interface DropdownOption {
        value: string | number;
        label: string;
    }

    const CurrencyOptions = [
        { value: 'INR', label: 'INR' },
        { value: 'USD', label: 'USD' },
    ];

    const { message, modal } = App.useApp();
    const [form] = Form.useForm();
    const [projectOptions, setProjectOptions] = useState<DropdownOption[]>([]);
    const [categoryOptions, setCategoryOptions] = useState<DropdownOption[]>([]);
    const [loadingProjects, setLoadingProjects] = useState(false);
    const [loadingCategory, setLoadingCategory] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [designationOptions, setDesignationOptions] = useState<DropdownOption[]>([]);
  const [loadingDesignations, setLoadingDesignations] = useState(true);

    useEffect(() => {
        fetchDesignations();
        // fetchProjects();
        // fetchCategories();
    }, []);

    const fetchProjects = async () => {
        setLoadingProjects(true);
        try {
            const projects = await getProjectList();
            const mappedOptions: DropdownOption[] = projects.map((d) => ({
                value: d.value,
                label: d.label
            }));
            setProjectOptions(mappedOptions);
        } catch {
            message.error('Failed to load projects');
        } finally {
            setLoadingProjects(false);
        }
    };
     const fetchDesignations = async () => {
          try {
            const designations = await getDesignationList();
            const mappedOptions: DropdownOption[] = designations.map((d) => ({
              value: d.value,
              label: d.label // handles API typo
            }));
            setDesignationOptions(mappedOptions);
          } catch (error) {
            console.error('Error fetching designations:', error);
          } finally {
            setLoadingDesignations(false);
          }
        };

    const fetchCategories = async () => {
        setLoadingCategory(true);
        try {
            const category = await getCategoryList();
            const mappedOptions: DropdownOption[] = category.map((d) => ({
                value: d.value,
                label: d.label
            }));
            setCategoryOptions(mappedOptions);
        } catch {
            message.error('Failed to load categories');
        } finally {
            setLoadingCategory(false);
        }
    };

    const onFinish = async (values: any) => {
        setSubmitting(true);
        try {
            const transformedValues = {
                ...values,
                expenses: values.expenses.map((expense: any) => ({
                    ...expense,
                    bill_raised_date: expense.bill_raised_date ? dayjs(expense.bill_raised_date).format('YYYY-MM-DD') : undefined,
                    bill_date: expense.bill_date ? dayjs(expense.bill_date).format('YYYY-MM-DD') : undefined,
                })),
            };

            const res = await applyReimbursement(transformedValues);
            if (res.success) {
                form.resetFields();
                modal.success({
                    title: 'Success',
                    content: <>Reimbursement applied successfully!</>,
                });
            } else {
                modal.error({
                    title: 'Error',
                    content: <>{res.message || 'Failed to apply reimbursement'}</>,
                });
            }
        } catch (err) {
            console.error(err);
            message.error('Failed to apply reimbursement');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Form
            form={form}
            onFinish={onFinish}
            layout="vertical"
            initialValues={{
                expenses: [{ currency: 'INR' }] // Initial expense item with default currency
            }}
        >
            <Row gutter={[16, 16]}>
                <Col xs={24} md={12}>
                    <Form.Item name="project" label="Project / Prospect" rules={[{ required: true, message: 'Please select a project!' }]}>
                        <Select
                            placeholder="Select Project"
                            options={designationOptions}
                            loading={loadingDesignations}
                            className="w-full"
                            notFoundContent={loadingDesignations ? <Spin size="small" /> : 'No projects available'}
                        />
                    </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                    <Form.Item name="claim_number" label="LNS Claim Number" rules={[{ required: true, message: 'Please enter a claim number!' }]}>
                        <Input placeholder="LNS Claim Number" />
                    </Form.Item>
                </Col>
                <Col xs={24}>
                    <Form.Item name="place_of_visit" label="Place of Visit" rules={[{ required: true, message: 'Please enter the place of visit!' }]}>
                        <Input placeholder="Place of Visit" />
                    </Form.Item>
                </Col>
            </Row>

            <Form.List name="expenses">
                {(fields, { add, remove }) => (
                    <>
                        {fields.map(({ key, name, ...restField }) => (
                            <div key={key}>
                                <Row gutter={[16, 16]} align="bottom" style={{ border: '1px dashed #d9d9d9', padding: '16px', borderRadius: '8px', marginBottom: '16px' }}>
                                    <Col xs={24} md={12}>
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'bill_raised_date']}
                                            label="Date of Raised"
                                        >
                                            <DatePicker style={{ width: '100%' }} format="DD-MM-YYYY" />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} md={12}>
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'bill_date']}
                                            label="Bill Date"
                                        >
                                            <DatePicker style={{ width: '100%' }} format="DD-MM-YYYY" />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} md={12}>
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'paid_to']}
                                            label="Paid To"
                                        >
                                            <Input placeholder="Paid To" />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} md={12}>
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'category']}
                                            label="Category"
                                        >
                                            <Select
                                                placeholder="Select Category"
                                                options={designationOptions}
                                                loading={loadingDesignations}
                                                className="w-full"
                                                notFoundContent={loadingDesignations ? <Spin size="small" /> : 'No category available'}
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} md={12}>
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'vendor']}
                                            label="Vendor"
                                        >
                                            <Input placeholder="Vendor" />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} md={6}>
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'amount']}
                                            label="Amount"
                                        >
                                            <Input type="number" placeholder="Amount" />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} md={6}>
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'currency']}
                                            label="Currency"
                                        >
                                            <Select options={CurrencyOptions} />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} md={12}>
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'advance_paid']}
                                            label="Advance Paid"
                                        >
                                            <Input type="number" placeholder="Advance Paid" />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} md={10}>
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'bill_attachment']}
                                            label="Bill Attachment"
                                            valuePropName="fileList"
                                            getValueFromEvent={(e) => {
                                                if (Array.isArray(e)) return e;
                                                return e?.fileList;
                                            }}
                                        >
                                            <Upload
                                                beforeUpload={() => false}
                                                maxCount={1}
                                                listType="text"
                                                accept=".pdf,.jpg,.jpeg,.png"
                                            >
                                                <Button icon={<UploadOutlined />}>Upload Bill</Button>
                                            </Upload>
                                        </Form.Item>
                                    </Col>
                                    {fields.length > 1 ? (
                                        <Col xs={24} md={2} style={{ display: 'flex', alignItems: 'center' }}>
                                            <MinusCircleOutlined onClick={() => remove(name)} style={{ fontSize: '24px', color: 'red' }} />
                                        </Col>
                                    ) : null}
                                </Row>
                            </div>
                        ))}
                        <Form.Item>
                            <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />} style={{ width: 'auto', margin: 'auto' }}>
                                Add Expense
                            </Button>
                        </Form.Item>
                    </>
                )}
            </Form.List>

            <Form.Item>
                <Button type="primary" htmlType="submit" loading={submitting} block style={{ width: 'auto', margin: 'auto' }}>
                    Save
                </Button>
            </Form.Item>
        </Form>
    );
}