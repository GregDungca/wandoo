//
//  TimeViewController.swift
//  ParseStarterProject-Swift
//
//  Created by William Lee on 12/15/15.
//  Copyright © 2015 Parse. All rights reserved.
//

import UIKit

class TimeViewController: UIViewController {

    override func viewDidLoad() {
        super.viewDidLoad()
        datePicker.addTarget(self, action: Selector("startDatePickerChanged:"), forControlEvents: UIControlEvents.ValueChanged)
         datePicker.addTarget(self, action: Selector("endDatePickerChanged:"), forControlEvents: UIControlEvents.ValueChanged)
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    func buttonAction(send: UIButton!) {
        self.performSegueWithIdentifier("toPostViewController", sender: self)
    }

    @IBAction func CancelTimeButton(sender: UIButton) {
    }
   
    @IBAction func SubmitTimeButton(sender: UIButton) {
    }
   
    @IBOutlet weak var datePicker: UIDatePicker!
    @IBOutlet weak var endTimeDatePicker: UIDatePicker!
   
    func startSatePickerChanged(datePicker:UIDatePicker) {
        let dateFormatter = NSDateFormatter()

    }
    
    func endDatePickerChanged(datePicker:UIDatePicker) {
        let dateFormatter = NSDateFormatter()
        
    }
}
