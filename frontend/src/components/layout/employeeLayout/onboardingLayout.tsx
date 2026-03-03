'use client';
import React, { useState, useEffect } from 'react';
import { CustomInput } from '@/components/ui/input';
import { Button, Select, Spin, message } from 'antd';
import { App } from 'antd';

import { onBoardEmployee, getDesignationList } from '@/services/authServices';

interface DropdownOption {
  value: string | number;
  label: string;
}


export function OnboardingLayout() {
  const [designationOptions, setDesignationOptions] = useState<DropdownOption[]>([]);
  const [loadingDesignations, setLoadingDesignations] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { modal, message } = App.useApp(); 

  // Form state
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    emp_id: '',
    designation: '' as string | number
  });

  // Fetch designations
  useEffect(() => {
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
    fetchDesignations();
  }, []);

  // Generic input change handler
  const handleChange = (field: keyof typeof formData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.username || !formData.email || !formData.designation) {
      message.error('Please fill all required fields');
      return;
    }

    setSubmitting(true);
    try {
      const res = await onBoardEmployee(formData);
      if(res.success) {
        setFormData({
          username: '',
          email: '',
          emp_id: '',
          designation: ''
        });
     modal.success({
        title: 'Success',
        content: <>Employee added successfully!</>,
      });
      }
      else{
       modal.error({
        title: 'Error',
        content: <>{res.message || 'Failed to onboard employee'}</>,
      });
      }
    } catch (err) {
      console.error(err);
      message.error('Failed to onboard employee');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="onboarding-layout">
      <div className="onboarding-content">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <CustomInput
              label="Username"
              placeholder="Enter employee username"
              required
              value={formData.username}
              onChange={(e) => handleChange('username', e.target.value)}
            />
            <CustomInput
              label="Email"
              type="email"
              placeholder="Enter employee email"
              required
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <CustomInput
              label="Employee ID"
              type="text"
              placeholder="Enter employee ID"
              value={formData.emp_id}
              onChange={(e) => handleChange('emp_id', e.target.value)}
            />
            <div className="mt-2.5">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Designation <span className="text-red-500 ml-1">*</span>
              </label>
              <Select
                placeholder="Select designation"
                value={formData.designation}
                onChange={(value) => handleChange('designation', value)}
                options={designationOptions}
                loading={loadingDesignations}
                className="w-full"
                notFoundContent={loadingDesignations ? <Spin size="small" /> : 'No designations available'}
              />
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <Button
              type="primary"
              className="w-full md:w-auto"
              htmlType="submit"
              loading={submitting}
            >
              Submit
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
