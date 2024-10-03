import type { DepartmentListItem } from './hooks/useDepartmentsList';

export const normalizeDepartments = async (departments: DepartmentListItem[], selectedDepartment: DepartmentListItem | undefined) => {
	if (!selectedDepartment) {
		return departments;
	}

	const isSelectedDepartmentAlreadyOnList = departments.find((department) => department._id === selectedDepartment._id);
	if (isSelectedDepartmentAlreadyOnList) {
		return departments;
	}

	return [{ _id: selectedDepartment._id, label: selectedDepartment.label, value: selectedDepartment._id }, ...departments];
};
