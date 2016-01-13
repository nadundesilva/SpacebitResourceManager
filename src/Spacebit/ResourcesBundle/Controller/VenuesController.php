<?php

namespace Spacebit\ResourcesBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use \Symfony\Component\HttpFoundation\Response;
use \Symfony\Component\HttpFoundation\Request;

class VenuesController extends Controller
{
    public function venuesAction()
    {
        $conn = $this->get('database_connection');
        $stmt = $conn->prepare('SELECT * FROM ');
        //$stmt->bindValue(':category', $category);
        $stmt->execute();
        $equipment = $stmt->fetchAll();

        $stmt = $conn->prepare('SELECT DISTINCT department.faculty_name FROM department');
        //$stmt->bindValue(':category', $category);
        $stmt->execute();
        $facNames = $stmt->fetchAll();

        return $this->render('SpacebitResourcesBundle:Default:equipment.html.twig', array(
            'equipment'=>$equipment,
            'facNames'=>$facNames,
        ));
    }
}
