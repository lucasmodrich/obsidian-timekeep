import { TimeEntry } from "@/timekeep/schema";
import { useDialog } from "@/contexts/use-dialog";
import { removeEntry, updateEntry } from "@/timekeep";
import { useSettings } from "@/contexts/use-settings-context";
import React, { useState, useEffect, FormEvent } from "react";
import { useTimekeepStore } from "@/contexts/use-timekeep-store";
import { parseEditableTimestamp, formatEditableTimestamp } from "@/utils";

import ObsidianIcon from "./ObsidianIcon";

type Props = {
	entry: TimeEntry;
	onFinishEditing: VoidFunction;
};

export default function TimesheetRowEditing({ entry, onFinishEditing }: Props) {
	const settings = useSettings();
	const { showConfirm } = useDialog();
	const timekeepStore = useTimekeepStore();

	const [name, setName] = useState(entry.name);
	const [startTime, setStartTime] = useState("");
	const [endTime, setEndTime] = useState("");

	useEffect(() => {
		setName(entry.name);
		setStartTime(
			entry.startTime
				? formatEditableTimestamp(entry.startTime, settings)
				: ""
		);
		setEndTime(
			entry.endTime
				? formatEditableTimestamp(entry.endTime, settings)
				: ""
		);
	}, [entry]);

	const onClickDelete = async () => {
		const confirmDelete = await showConfirm(
			"Confirm Delete",
			"Are you sure you want to delete this entry?"
		);

		if (!confirmDelete) {
			return;
		}

		timekeepStore.setState((timekeep) => ({
			entries: removeEntry(timekeep.entries, entry),
		}));
	};

	const onSubmit = (event: FormEvent) => {
		event.preventDefault();
		event.stopPropagation();

		const newEntry = { ...entry, name };

		// Update the start and end times for non groups
		if (newEntry.subEntries === null) {
			if (entry.startTime !== null) {
				const startTimeValue = parseEditableTimestamp(
					startTime,
					settings
				);
				if (startTimeValue.isValid()) {
					newEntry.startTime = startTimeValue;
				}
			}

			if (entry.endTime !== null) {
				const endTimeValue = parseEditableTimestamp(endTime, settings);
				if (endTimeValue.isValid()) {
					newEntry.endTime = endTimeValue;
				}
			}
		}

		// Save the updated entry
		timekeepStore.setState((timekeep) => ({
			entries: updateEntry(timekeep.entries, entry.id, newEntry),
		}));

		onFinishEditing();
	};

	return (
		<tr>
			<td colSpan={5}>
				<form className="timesheet-editing" onSubmitCapture={onSubmit}>
					<label>
						Name
						<input
							className="timekeep-input"
							type="text"
							value={name}
							onChange={(event) => setName(event.target.value)}
						/>
					</label>
					{entry.startTime && (
						<label>
							Start Time
							<input
								className="timekeep-input"
								type="text"
								value={startTime}
								onChange={(event) =>
									setStartTime(event.target.value)
								}
							/>
						</label>
					)}
					{entry.endTime && (
						<label>
							End Time
							<input
								className="timekeep-input"
								type="text"
								value={endTime}
								onChange={(event) =>
									setEndTime(event.target.value)
								}
							/>
						</label>
					)}
					<div className="timesheet-editing-actions">
						<button type="submit" className="timekeep-action">
							<ObsidianIcon
								icon="edit"
								className="text-button-icon"
							/>
							Save
						</button>
						<button
							type="button"
							onClick={onFinishEditing}
							className="timekeep-action">
							<ObsidianIcon
								icon="x"
								className="text-button-icon"
							/>
							Cancel
						</button>
						<button
							type="button"
							onClick={onClickDelete}
							className="timekeep-action timekeep-action--end">
							<ObsidianIcon
								icon="trash"
								className="text-button-icon"
							/>
							Delete
						</button>
					</div>
				</form>
			</td>
		</tr>
	);
}
