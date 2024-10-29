class Node {

	constructor(project) {
		this.data = project;
		this.next = null;
		this.prev = null;
	}
}


export class DoublyLinkedList {

	constructor() {
		this.head = null;
		this.tail = null;
	}

	isEmpty() {
		if (this.head == null) return true;
		return false;
	}
 
	// Method to add item at the last of doubly linked list
	addProject(project) {
		
		let temp = new Node(project);
           
		if (this.head == null) {
			this.head = temp;
			this.tail = temp;
		}
		
		else {
			this.tail.next = temp;
			temp.prev = this.tail;
			this.tail = this.tail.next;
		}
	}

	removeProject(projectId) { 
        let current = this.head;
        
        while (current) { 
            if (current.data.id === projectId) {
                if (current === this.head && current === this.tail) {
                    // Only one item in the list
                    this.head = null; 
                    this.tail = null; 
                } else if (current === this.head) {
                    // Removing the head
					this.head = this.head.next;
                    this.head.prev = null;
                } else if (current === this.tail) {
                    // Removing the tail
                    this.tail = this.tail.prev;
                    this.tail.next = null;
                } else {
                    // Removing a node in the middle
                    current.prev.next = current.next;
                    current.next.prev = current.prev;
                }
                this.size--;
                return true;
            }
            current = current.next;
        }
        return false; // Project not found
    }

	getAllProjects() {
        const projects = [];
        let current = this.head;
        while (current != null) {
            projects.push(current.project);
            current = current.next;
        }
        return projects;
    }

	clear(){
		this.head = null;
		this.tail = null;
	}
}

